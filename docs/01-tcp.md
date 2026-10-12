**English** | [Português](01-tcp-pt-BR.md)

# TCP Server

Redis clients connect to the Redis server through a TCP connection. TCP creates a reliable connection between the client and the server, allowing both sides to send data to each other.

The TCP protocol only receives and sends **bytes**; it doesn't know what those bytes mean. This is different from protocols like HTTP, which carry a lot of structure: HTTP knows what a header is, what a body is, etc.

Redis uses TCP as the "pipe" that keeps the connection, and has its own protocol, RESP.

### How not-redis handles events

To accept TCP connections, we use Bun's own server, with `Bun.listen`, which creates a TCP server and lets us handle connections easily.

We handle three different events (they can be found in `main.ts`):

- `open`: Happens when a new client establishes a connection with the server. It brings information like the IP of that connection and also lets us save data specific to it;
- `data`: Happens when an already connected client sends a sequence of **bytes** to the server. Through this event, we can read which bytes were sent and also access the data of that connection. Important: a `data` event is not necessarily a whole command. Since TCP only delivers a stream of bytes, a command can arrive split into two events, or two commands can arrive together in one. That's why each connection keeps a buffer in `socket.data`;
- `close`: Happens when a connection is closed. We can clean up the data that belonged to it and free memory / processing.

### Event loop

For `not-redis` to handle multiple connections requesting and sending data quickly, it doesn't get stuck waiting for a connection to finish its request: it takes turns between the clients while they make their requests, without waiting for them to finish. This works because each request is very fast: `not-redis` keeps the values in RAM, which makes lookups extremely fast.

While a client hasn't finished its request, the server keeps adding the request's data, as it arrives, to a **buffer** reserved for that connection. Whenever a request arrives complete, it executes it and removes it from the buffer.
