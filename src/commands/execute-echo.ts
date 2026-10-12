import { bulkString } from "../resp";
import type { Command } from ".";

export const executeEcho: Command = (args) => {
	const value = args[0] as string;

	return bulkString(value);
};
