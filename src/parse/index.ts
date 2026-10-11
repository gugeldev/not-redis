type ReadLineResult = { line: string; next: number };
type ParseResult = { command: string[]; bytesRead: number };

const readLine = (buffer: Buffer, start: number): ReadLineResult | null => {
	const end = buffer.indexOf("\r\n", start);

	if (end === -1) return null;

	const line = buffer.subarray(start, end).toString();

	return { line, next: end + 2 };
};

/**
 * Parses a RESP command into its parts.
 * e.g. "*2\r\n$3\r\nGET\r\n$4\r\nnome\r\n" → ["GET", "nome"]
 * @param input raw RESP string received from the client
 * @throws {Error} when the input is not a valid RESP array
 */
export const parse = (buffer: Buffer): ParseResult | null => {
	const header = readLine(buffer, 0);
	if (header === null) return null;

	if (header.line[0] !== "*") throw new Error('Invalid input: expected "*"');

	const count = Number(header.line.slice(1));
	if (!Number.isInteger(count) || count < 1) throw new Error("Invalid input");

	const result: string[] = [];

	let pos = header.next;

	for (let i = 0; i < count; i++) {
		const size = readLine(buffer, pos);
		if (size === null) return null;
		if (size.line[0] !== "$") throw new Error('Invalid input: expected "$"');

		const length = Number(size.line.slice(1));
		pos = size.next;

		if (pos + length + 2 > buffer.length) return null;

		const value = buffer.subarray(pos, pos + length).toString();
		result.push(value);

		pos = pos + length + 2;
	}

	return { command: result, bytesRead: pos };
};
