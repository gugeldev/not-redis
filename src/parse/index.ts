/**
 * Parses a RESP command into its parts.
 * e.g. "*2\r\n$3\r\nGET\r\n$4\r\nnome\r\n" → ["GET", "nome"]
 * @param input raw RESP string received from the client
 * @throws {Error} when the input is not a valid RESP array
 */
export const parse = (input: string): string[] => {
	const splittedInput = input.split("\r\n");

	if (!splittedInput[0]) throw new Error("Empty input");

	if (splittedInput[0][0] !== "*")
		throw new Error('Invalid input: expected "*"');

	const header = Number(splittedInput[0].slice(1));

	if (!Number.isInteger(header) || header < 1) throw new Error("Invalid input");

	const result = [];

	for (let i = 0; i < header; i++) {
		const index = 2 + i * 2;
		const value = splittedInput[index];

		if (value === undefined)
			throw new Error(`Protocol error: expected ${header}, got ${i}`);

		result.push(value);
	}

	return result;
};
