import { getEntry } from "../store";
import type { Command } from ".";

export const executeTtl: Command = (args) => {
	const key = args[0] as string;

	const entry = getEntry(key);

	if (entry === undefined) return `:-2\r\n`;

	if (!entry.expiresAt) return `:-1\r\n`;

	const secondsLeft = Math.ceil((entry.expiresAt - Date.now()) / 1000);

	return `:${secondsLeft}\r\n`;
};
