export const bulkString = (value: string) =>
	`$${Buffer.byteLength(value)}\r\n${value}\r\n`;
