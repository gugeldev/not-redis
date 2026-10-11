import { getEntry, store } from "../store";
import type { Command } from ".";

export const executeGet: Command = (args) => {
	const key = args[0];

	if (key === undefined)
		return `-ERR wrong number of arguments for 'get' command\r\n`;

	const entry = getEntry(key);

	if (entry === undefined) return `$-1\r\n`;

	const bytesLength = Buffer.byteLength(entry.value);

	return `$${bytesLength}\r\n${entry.value}\r\n`;
};
