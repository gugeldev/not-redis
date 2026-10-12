import { EntryType, getEntry, store } from "../store";
import type { Command } from ".";

export const executeRpush: Command = (args) => {
	const [key, ...values] = args as [string, ...string[]];

	const entry = getEntry(key);

	if (entry === undefined) {
		store.set(key, { type: EntryType.LIST, value: values });
		return `:${values.length}\r\n`;
	}

	if (entry.type !== EntryType.LIST)
		return `-WRONGTYPE Operation against a key holding the wrong kind of value\r\n`;

	entry.value.push(...values);

	return `:${entry.value.length}\r\n`;
};
