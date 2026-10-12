import { error, integer, WRONGTYPE } from "../resp";
import { EntryType, getEntry, store } from "../store";
import type { Command } from ".";

export const executeIncr: Command = (args) => {
	const key = args[0] as string;

	const entry = getEntry(key);

	if (entry === undefined) {
		store.set(key, { type: EntryType.STRING, value: "1" });
		return integer(1);
	}

	if (entry.type !== EntryType.STRING) return WRONGTYPE;

	const value = Number(entry.value);

	if (!Number.isInteger(value) || String(value) !== entry.value)
		return error(`ERR value is not an integer or out of range`);

	const incr = value + 1;
	entry.value = String(incr);
	return integer(incr);
};
