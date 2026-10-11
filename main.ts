import { parse } from "./src/parse";
import { commands } from "./src/commands";


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
        const [name, ...args] = parse(data.toString());
        const command = name ? commands[name.toUpperCase()] : undefined;

        if (!command) {
          socket.write(`-ERR unknowed command '${name}'\r\n`);
          return;
        }

        socket.write(command(args));
      },
      close: (socket) => console.log('Client disconnected')
    }
  });

  console.log(`Server listening at: ${server.hostname}:${server.port}`);
}

ignite();
