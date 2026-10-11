import { bulkString } from "../resp";
import { EntryType, getEntry } from "../store";
import type { Command } from ".";

export const executeGet: Command = (args) => {
	const key = args[0];

	if (key === undefined)
		return `-ERR wrong number of arguments for 'get' command\r\n`;

	const entry = getEntry(key);

	if (entry === undefined) return `$-1\r\n`;

	if (entry.type !== EntryType.STRING)
		return `-WRONGTYPE Operation against a key holding the wrong kind of value\r\n`;

	return bulkString(entry.value);
};
