**English** | [Português](03-parser-pt-BR.md)

# Parser

Finally, we got to the parser, the main "engine", responsible for understanding the bytes that arrive in RESP format and turning them into a real command.

### The problem

Whenever a new event (a new chunk of data) arrives at `data`, it brings the bytes of that event, but they don't always form a complete command: a command from a client can arrive split in the middle, across several events. This is where the important part of our parser comes in: it must support whole commands, identify incomplete commands and also handle several commands at once.

### Buffer

Since messages can arrive incomplete/split, we create a buffer for each TCP connection. This way, whenever new bytes arrive, we keep storing them in the buffer. With every new chunk of data, our parser checks if there are complete commands that can be executed. If there are, the server executes them and clears the already executed part from the buffer, leaving only the still incomplete commands, which need to wait for new data to arrive.

### The loop

In `main.ts`, whenever a new `data` arrives, we append the bytes to the buffer and run this loop:

```ts
while (true) {
  const parsed = parse(socket.data.buffer);
  if (parsed === null) break;
  socket.write(execute(parsed.command));
  socket.data.buffer = socket.data.buffer.subarray(parsed.bytesRead);
}
```

`parse` tries to read a command from the start of the buffer and can return two things:

- `null`: the command is still incomplete, so we leave the loop and wait for the next `data`;
- `{ command, bytesRead }`: a complete command (ex: `["GET", "name"]`) and how many bytes it took in the buffer.

When the command is complete, the server executes it, replies to the client and cuts that command's `bytesRead` bytes from the buffer. After that the loop runs again, because there may be another command right behind it.

For example, imagine a `data` arrives with a whole `PING` and half of a `GET`:

```
buffer: [complete PING][GET cut in ha...]
```

1. On the first pass, `parse` reads the `PING` and returns `{ command: ["PING"], bytesRead: 14 }`. The server replies `+PONG` and cuts the 14 bytes, so the buffer is left with only `[GET cut in ha...]`;
2. On the second pass, `parse` tries to read the `GET`, but bytes are missing, so it returns `null` and we leave the loop;
3. When a new `data` arrives with the rest of the `GET`, it's appended to the buffer and the loop runs again: now the `GET` is complete, it gets executed and cut, and the buffer is empty.

To sum up: the `while` exists because there may be more than one command in the buffer, `null` means "wait for more bytes" and `bytesRead` says how much to cut. This case of several commands arriving together even has a name: **pipelining**, when the client sends several commands without waiting for the replies.
