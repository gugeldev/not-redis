import { error, integer } from "../resp";
import { getEntry } from "../store";
import type { Command } from ".";

export const executePexpireat: Command = (args) => {
	const [key, ex] = args as [string, string];

	const entry = getEntry(key);

	if (entry === undefined) return integer(0);

	const timestamp = Number(ex);

	if (!Number.isInteger(timestamp) || timestamp <= 0)
		return error(`ERR invalid expire time in 'pexpireat' command`);

	entry.expiresAt = timestamp;

	return integer(1);
};
