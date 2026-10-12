import { EntryType, getEntry } from "../store";
import type { Command } from ".";

export const executeLlen: Command = (args) => {
	const key = args[0] as string;

	const entry = getEntry(key);

	if (entry === undefined) return `:0\r\n`;

	if (entry.type !== EntryType.LIST)
		return `-WRONGTYPE Operation against a key holding the wrong kind of value\r\n`;

	return `:${entry.value.length}\r\n`;
};
