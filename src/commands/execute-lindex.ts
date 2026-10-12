import { bulkString, error, NULL_BULK, WRONGTYPE } from "../resp";
import { EntryType, getEntry } from "../store";
import type { Command } from ".";

export const executeLindex: Command = (args) => {
	const [key, idx] = args as [string, string];

	const index = Number(idx);

	if (!Number.isInteger(index) || String(index) !== idx)
		return error(`ERR value is not an integer or out of range`);

	const entry = getEntry(key);

	if (entry === undefined) return NULL_BULK;

	if (entry.type !== EntryType.LIST) return WRONGTYPE;

	const value = entry.value.at(index);

	if (value !== undefined) return bulkString(value);

	return NULL_BULK;
};
