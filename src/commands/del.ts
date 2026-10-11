import { getEntry, store } from "../store";
import type { Command } from ".";

export const executeDel: Command = (args) => {
	if (!args.length)
		return `-ERR wrong number of arguments for 'del' command\r\n`;

	let count = 0;

	for (const key of args) {
		const entry = getEntry(key);
		if (entry !== undefined) {
			store.delete(key);
			count++;
		}
	}

	return `:${count}\r\n`;
};
