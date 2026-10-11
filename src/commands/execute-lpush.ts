import { EntryType, getEntry, store } from "../store";
import type { Command } from ".";

export const executeLpush: Command = (args) => {
	const [key, ...values] = args;

	if (key === undefined || values.length === 0)
		return `-ERR wrong number of arguments for 'lpush' command\r\n`;

	const entry = getEntry(key);
	values.reverse();

	if (entry === undefined) {
		store.set(key, { type: EntryType.LIST, value: values });
		return `:${values.length}\r\n`;
	}

	if (entry.type !== EntryType.LIST)
		return `-WRONGTYPE Operation against a key holding the wrong kind of value\r\n`;

	entry.value.unshift(...values);

	return `:${entry.value.length}\r\n`;
};
