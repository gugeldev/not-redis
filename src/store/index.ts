export enum EntryType {
	LIST,
	STRING,
}

type Entry =
	| { type: EntryType.STRING; value: string; expiresAt?: number }
	| { type: EntryType.LIST; value: string[]; expiresAt?: number };

export const getEntry = (key: string): Entry | undefined => {
	const entry = store.get(key);

	if (entry === undefined) return undefined;

	if (entry.expiresAt !== undefined && Date.now() >= entry.expiresAt) {
		store.delete(key);
		return undefined;
	}

	return entry;
};

export const store = new Map<string, Entry>();
