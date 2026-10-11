import { bulkString } from "../resp";
import { EntryType, getEntry } from "../store";
import type { Command } from ".";

export const executeLrange: Command = (args) => {
	const [key, start, end] = args;

	if (key === undefined || start === undefined || end === undefined)
		return `-ERR wrong number of arguments for 'lrange' command\r\n`;

	const startIdx = Number(start);
	const endIdx = Number(end);

	if (String(startIdx) !== start || String(endIdx) !== end)
		return `-ERR value is not an integer or out of range\r\n`;

	const entry = getEntry(key);

	if (entry === undefined) return `*0\r\n`;

	if (entry.type !== EntryType.LIST)
		return `-WRONGTYPE Operation against a key holding the wrong kind of value\r\n`;

	const items = entry.value.slice(
		startIdx,
		endIdx === -1 ? undefined : endIdx + 1,
	);

	let response = `*${items.length}\r\n`;

	for (const item of items) {
		response += bulkString(item);
	}

	return response;
};
