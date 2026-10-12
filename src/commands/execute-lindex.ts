import { bulkString } from "../resp";
import { EntryType, getEntry } from "../store";
import type { Command } from ".";

export const executeLindex: Command = (args) => {
	const key = args[0];
	const idx = args[1];

	if (key === undefined || idx === undefined)
		return `-ERR wrong number of arguments for 'lindex' command\r\n`;

	const index = Number(idx);

	if (!Number.isInteger(index) || String(index) !== idx)
		return `-ERR value is not an integer or out of range\r\n`;

	const entry = getEntry(key);

	if (entry === undefined) return `$-1\r\n`;

	if (entry.type !== EntryType.LIST)
		return `-WRONGTYPE Operation against a key holding the wrong kind of value\r\n`;

	const value = entry.value.at(index);

	if (value !== undefined) return bulkString(value);

	return `$-1\r\n`;
};
