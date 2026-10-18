import { execute } from "./execute";
import { parse } from "./parse";
import { openAof, readAof } from "./writer";

/**
 * Restore AOF
 * Reads the AOF file and restores the values into memory
 */
export const restoreAof = async () => {
	let aofBuffer = await readAof();

	if (aofBuffer) {
		while (true) {
			const parsed = parse(aofBuffer);
			if (parsed === null) break;
			execute(parsed.command, false);
			aofBuffer = aofBuffer.subarray(parsed.bytesRead);
		}
	}

	openAof();
};
