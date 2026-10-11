import { expect, test } from "bun:test";
import { parse } from "./";

test("parses SET command", () => {
	const input = Buffer.from("*3\r\n$3\r\nSET\r\n$4\r\nnome\r\n$4\r\nJoao\r\n");

	expect(parse(input)).toEqual({
		command: ["SET", "nome", "Joao"],
		bytesRead: input.length,
	});
});

test("returns null when the command is incomplete", () => {
	const input = Buffer.from("*2\r\n$4\r\nECHO\r\n$2\r\no");

	expect(parse(input)).toBeNull();
});
