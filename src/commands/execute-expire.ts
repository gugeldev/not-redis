import { getEntry } from "../store";
import type { Command } from ".";

export const executeExpire: Command = (args) => {
	const key = args[0];
	const ex = args[1];

	if (key === undefined || ex === undefined)
		return `-ERR wrong number of arguments for 'expire' command\r\n`;

	const entry = getEntry(key);

	if (entry === undefined) return `:0\r\n`;

	const seconds = Number(ex);

	if (!Number.isInteger(seconds) || seconds <= 0)
		return `-ERR invalid expire time in 'expire' command\r\n`;

	entry.expiresAt = Date.now() + seconds * 1000;

	return `:1\r\n`;
};
