/**
 * Helpers to encode command replies in RESP (Redis Serialization Protocol).
 */

/** `bulkString("hi")` → `$2\r\nhi\r\n` (length in bytes, not characters) */
export const bulkString = (value: string) =>
	`$${Buffer.byteLength(value)}\r\n${value}\r\n`;

/** `integer(5)` → `:5\r\n` */
export const integer = (n: number) => `:${n}\r\n`;

/** `simpleString("OK")` → `+OK\r\n` */
export const simpleString = (s: string) => `+${s}\r\n`;

/** `array([integer(1), NULL_BULK])` → `*2\r\n:1\r\n$-1\r\n` (items must already be encoded) */
export const array = (items: string[]) =>
	`*${items.length}\r\n${items.join("")}`;

/** `error("ERR boom")` → `-ERR boom\r\n` */
export const error = (msg: string) => `-${msg}\r\n`;

/** Null bulk string: `$-1\r\n` */
export const NULL_BULK = `$-1\r\n`;

/** Error for commands run against a key of the wrong type */
export const WRONGTYPE = error(
	`WRONGTYPE Operation against a key holding the wrong kind of value`,
);
