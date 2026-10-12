import { integer, WRONGTYPE } from "../resp";
import { EntryType, getEntry, store } from "../store";
import type { Command } from ".";

export const executeLpush: Command = (args) => {
	const [key, ...values] = args as [string, ...string[]];

	const entry = getEntry(key);
	values.reverse();

	if (entry === undefined) {
		store.set(key, { type: EntryType.LIST, value: values });
		return integer(values.length);
	}

	if (entry.type !== EntryType.LIST) return WRONGTYPE;

	entry.value.unshift(...values);

	return integer(entry.value.length);
};
