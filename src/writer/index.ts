import { fsyncSync, openSync, writeSync } from "node:fs";
import { array, bulkString } from "../resp";

const AOF_FILENAME = "registry.aof";

const fd = openSync(AOF_FILENAME, "a");

export const appendToAof = (command: string[]) => {
	writeSync(fd, array(command.map(bulkString)));
};

setInterval(() => fsyncSync(fd), 1000);

export const readAof = async () => {
	const file = Bun.file(AOF_FILENAME);

	if (await file.exists()) return Buffer.from(await file.arrayBuffer());

	return null;
};
