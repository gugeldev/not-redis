import { EntryType, store } from "../store";
import type { Command } from ".";

export const executeSet: Command = (args) => {
	const key = args[0];
	const value = args[1];
	const ex = args[2];

	if (key === undefined || value === undefined)
		return `-ERR wrong number of arguments for 'set' command\r\n`;

	let expiresAt: number | undefined;

	if (ex?.toUpperCase() === "EX") {
		const seconds = Number(args[3]);
		if (!Number.isInteger(seconds) || seconds <= 0)
			return `-ERR invalid expire time in 'set' command\r\n`;

		expiresAt = Date.now() + seconds * 1000;
	}

	store.set(key, {
		type: EntryType.STRING,
		value,
		expiresAt,
	});

	return `+OK\r\n`;
};
