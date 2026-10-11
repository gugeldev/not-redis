import { bulkString } from "../resp";
import { EntryType, getEntry, store } from "../store";
import type { Command } from ".";

export const executeRpop: Command = (args) => {
	const key = args[0];

	if (key === undefined)
		return `-ERR wrong number of arguments for 'rpop' command\r\n`;

	const entry = getEntry(key);

	if (entry === undefined) return `$-1\r\n`;

	if (entry.type !== EntryType.LIST)
		return `-WRONGTYPE Operation against a key holding the wrong kind of value\r\n`;

	const value = entry.value.pop();

	if (entry.value.length === 0) store.delete(key);

	return bulkString(value!);
};
