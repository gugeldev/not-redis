import { bulkString, NULL_BULK, WRONGTYPE } from "../resp";
import { EntryType, getEntry, store } from "../store";
import type { Command } from ".";

export const executeLpop: Command = (args) => {
	const key = args[0] as string;

	const entry = getEntry(key);

	if (entry === undefined) return NULL_BULK;

	if (entry.type !== EntryType.LIST) return WRONGTYPE;

	const value = entry.value.shift();

	if (entry.value.length === 0) store.delete(key);

	if (value === undefined) return NULL_BULK;

	return bulkString(value);
};
