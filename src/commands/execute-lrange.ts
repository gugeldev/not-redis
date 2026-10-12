import { array, bulkString, error, WRONGTYPE } from "../resp";
import { EntryType, getEntry } from "../store";
import type { Command } from ".";

export const executeLrange: Command = (args) => {
	const [key, start, end] = args as [string, string, string];

	const startIdx = Number(start);
	const endIdx = Number(end);

	if (String(startIdx) !== start || String(endIdx) !== end)
		return error(`ERR value is not an integer or out of range`);

	const entry = getEntry(key);

	if (entry === undefined) return array([]);

	if (entry.type !== EntryType.LIST) return WRONGTYPE;

	const items = entry.value.slice(
		startIdx,
		endIdx === -1 ? undefined : endIdx + 1,
	);

	return array(items.map(bulkString));
};
