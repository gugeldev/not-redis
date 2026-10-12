import { integer, WRONGTYPE } from "../resp";
import { EntryType, getEntry } from "../store";
import type { Command } from ".";

export const executeLlen: Command = (args) => {
	const key = args[0] as string;

	const entry = getEntry(key);

	if (entry === undefined) return integer(0);

	if (entry.type !== EntryType.LIST) return WRONGTYPE;

	return integer(entry.value.length);
};
