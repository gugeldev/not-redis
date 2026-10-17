import { fsyncSync, openSync, writeSync } from "node:fs";
import { array, bulkString } from "../resp";
import { getEntry } from "../store";

const AOF_FILENAME = "registry.aof";

const fd = openSync(AOF_FILENAME, "a");

export const appendToAof = (command: string[]) => {
	writeSync(fd, array(command.map(bulkString)));
};

/**
 * Relative expirations (SET ... EX, EXPIRE) are saved as an absolute
 * PEXPIREAT, so a replay doesn't give the key a new lifetime.
 */
export const toAofCommands = (command: string[]) => {
	const [name, key, value] = command as [string, string, string?];

	const commandName = name.toUpperCase();

	if (commandName !== "SET" && commandName !== "EXPIRE") return [command];

	const aofCommands: string[][] = [];

	if (commandName === "SET") aofCommands.push(["SET", key, value as string]);

	const expiresAt = getEntry(key)?.expiresAt;

	if (expiresAt !== undefined)
		aofCommands.push(["PEXPIREAT", key, String(expiresAt)]);

	return aofCommands;
};

setInterval(() => fsyncSync(fd), 1000);

export const readAof = async () => {
	const file = Bun.file(AOF_FILENAME);

	if (await file.exists()) return Buffer.from(await file.arrayBuffer());

	return null;
};
