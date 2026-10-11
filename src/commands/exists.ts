import { getEntry } from "../store";
import type { Command } from ".";

export const executeExists: Command = (args) => {
	if (!args.length)
		return `-ERR wrong number of arguments for 'exists' command\r\n`;

	let count = 0;

	for (const key of args) {
		const entry = getEntry(key);
		if (entry !== undefined) count++;
	}

	return `:${count}\r\n`;
};
