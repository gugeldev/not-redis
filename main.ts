import { execute } from "./src/execute";

/**
 * TCP Server
 * Responsible for receiving and sending data between client and server
 */
const ignite = () => {
	const server = Bun.listen({
		hostname: "127.0.0.1",
		port: 7777,
		socket: {
			open: (socket) => {
				console.log(`Client connected. IP: ${socket.remoteAddress}`);
			},
			data: (socket, data) => {
				const response = execute(data.toString());
				socket.write(response);
			},
			close: (socket) => {
				console.log(`Client disconnected. IP: ${socket.remoteAddress}`);
			},
		},
	});

	console.log(`Server listening at: ${server.hostname}:${server.port}`);
};

ignite();
