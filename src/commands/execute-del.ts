import { integer } from "../resp";
import { getEntry, store } from "../store";
import type { Command } from ".";

export const executeDel: Command = (args) => {
	let count = 0;

	for (const key of args) {
		const entry = getEntry(key);
		if (entry !== undefined) {
			store.delete(key);
			count++;
		}
	}

	return integer(count);
};
