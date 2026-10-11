import { parse } from "./src/parse";

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
      },
      close: (socket) => console.log('Client disconnected')
    }
  });

  console.log(`Server listening at: ${server.hostname}:${server.port}`);
}

ignite();
