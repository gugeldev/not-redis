import { execute } from "./execute";
import { parse } from "./parse";

/**
 * TCP Server
 * Responsible for receiving and sending data between client and server
 */
export const initServer = (port: number, persistence: boolean) => {
	const server = Bun.listen<{ buffer: Buffer }>({
		hostname: "127.0.0.1",
		port,
		socket: {
			open: (socket) => {
				console.log(`Client connected. IP: ${socket.remoteAddress}`);
				socket.data = { buffer: Buffer.alloc(0) };
			},
			data: (socket, data) => {
				socket.data.buffer = Buffer.concat([socket.data.buffer, data]);

				try {
					while (true) {
						const parsed = parse(socket.data.buffer);
						if (parsed === null) break; /** Incomplete data */

						socket.write(execute(parsed.command, persistence));

						socket.data.buffer = socket.data.buffer.subarray(parsed.bytesRead);
					}
				} catch (error) {
					socket.write(`-ERR Protocol error: ${(error as Error).message}\r\n`);
					socket.end();
				}
			},
			close: (socket) => {
				console.log(`Client disconnected. IP: ${socket.remoteAddress}`);
			},
		},
	});

	console.log(`Server listening at: ${server.hostname}:${server.port}`);
};
