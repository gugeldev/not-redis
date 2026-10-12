import { integer } from "../resp";
import { getEntry } from "../store";
import type { Command } from ".";

export const executeTtl: Command = (args) => {
	const key = args[0] as string;

	const entry = getEntry(key);

	if (entry === undefined) return integer(-2);

	if (!entry.expiresAt) return integer(-1);

	const secondsLeft = Math.ceil((entry.expiresAt - Date.now()) / 1000);

	return integer(secondsLeft);
};
