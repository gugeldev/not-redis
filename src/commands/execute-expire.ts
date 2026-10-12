import { error, integer } from "../resp";
import { getEntry } from "../store";
import type { Command } from ".";

export const executeExpire: Command = (args) => {
	const [key, ex] = args as [string, string];

	const entry = getEntry(key);

	if (entry === undefined) return integer(0);

	const seconds = Number(ex);

	if (!Number.isInteger(seconds) || seconds <= 0)
		return error(`ERR invalid expire time in 'expire' command`);

	entry.expiresAt = Date.now() + seconds * 1000;

	return integer(1);
};
