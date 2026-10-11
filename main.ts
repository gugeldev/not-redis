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
        console.log(`Buffer: `, data);
        socket.write(data);
      },
      close: (socket) => console.log('Client disconnected')
    }
  });

  console.log(`Server listening at: ${server.hostname}:${server.port}`);
}

ignite();
