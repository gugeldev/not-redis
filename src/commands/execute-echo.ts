import { bulkString } from "../resp";
import type { Command } from ".";

export const executeEcho: Command = (args) => {
	const value = args[0];

	if (value === undefined)
		return `-ERR wrong number of arguments for 'echo' command\r\n`;

	return bulkString(value);
};
