import { EntryType, store } from "../store";
import type { Command } from ".";

export const executeSet: Command = (args) => {
	const [key, value, ex] = args as [string, string, string?];

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
