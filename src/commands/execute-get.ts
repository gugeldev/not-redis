import { bulkString, NULL_BULK, WRONGTYPE } from "../resp";
import { EntryType, getEntry } from "../store";
import type { Command } from ".";

export const executeGet: Command = (args) => {
	const key = args[0] as string;

	const entry = getEntry(key);

	if (entry === undefined) return NULL_BULK;

	if (entry.type !== EntryType.STRING) return WRONGTYPE;

	return bulkString(entry.value);
};
