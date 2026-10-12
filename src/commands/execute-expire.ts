import { getEntry } from "../store";
import type { Command } from ".";

export const executeExpire: Command = (args) => {
	const [key, ex] = args as [string, string];

	const entry = getEntry(key);

	if (entry === undefined) return `:0\r\n`;

	const seconds = Number(ex);

	if (!Number.isInteger(seconds) || seconds <= 0)
		return `-ERR invalid expire time in 'expire' command\r\n`;

	entry.expiresAt = Date.now() + seconds * 1000;

	return `:1\r\n`;
};
