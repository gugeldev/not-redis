import { getEntry, store } from "../store";
import type { Command } from ".";

export const executeIncr: Command = (args) => {
	const key = args[0];

	if (key === undefined)
		return `-ERR wrong number of arguments for 'incr' command\r\n`;

	const entry = getEntry(key);

	if (entry === undefined) {
		store.set(key, { value: "1" });
		return `:1\r\n`;
	}

	const value = Number(entry.value);

	if (!Number.isInteger(value) || String(value) !== entry.value)
		return `-ERR value is not an integer or out of range\r\n`;

	const incr = value + 1;
	entry.value = String(incr);
	return `:${incr}\r\n`;
};
