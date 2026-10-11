import { parse } from "./src/parse";

const store = new Map<string, string>();

/**
 * TCP Server
 * Responsible for receiving and sending data between client and server
 */
const ignite = () => {
  const server = Bun.listen({
    hostname: "127.0.0.1",
    port: 7777,
    socket: {
      open: (socket) => console.log('Client connected'),
      data: (socket, data) => {
        const parsedData = parse(data.toString());

        const command = parsedData[0];

        if (command === 'PING')
          socket.write('+PONG\r\n');
        if (command === 'ECHO')
          socket.write(`$${parsedData[1]?.length}\r\n${parsedData[1]}\r\n`);
        if (command === 'SET') {
          const key = parsedData[1];
          const value = parsedData[2];
          if (key === undefined || value === undefined)
            socket.write(`-ERR wrong number of arguments for 'set' command\r\n`);
          else {
            store.set(key, value);
            socket.write(`+OK\r\n`);
          }
        }
        if (command === 'GET') {
          const key = parsedData[1];
          if (key === undefined) socket.write(`-ERR wrong number of arguments for 'get' command\r\n`);
          else {
            const value = store.get(key);

            if (value === undefined) socket.write(`$-1\r\n`);
            else socket.write(`$${value.length}\r\n${value}\r\n`);
          }
        }
      },
      close: (socket) => console.log('Client disconnected')
    }
  });

  console.log(`Server listening at: ${server.hostname}:${server.port}`);
}

ignite();
