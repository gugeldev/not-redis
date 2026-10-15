**English** | [Português](05-store-pt-BR.md)

# Store

The store is where the data is actually kept. In not-redis, it's just a JavaScript `Map`, which lives in RAM (in `src/store`):

```ts
export const store = new Map<string, Entry>();
```

Since the module is only loaded once, every connection shares the same `Map`. That means if one client does `SET name Joao`, another client can read it with `GET name`.

### Data types

In Redis, each key holds a value of a specific type. In not-redis, we have two types: string and list. Each value stored in the `Map` is an `Entry`, which says what its type is:

```ts
type Entry =
	| { type: EntryType.STRING; value: string; expiresAt?: number }
	| { type: EntryType.LIST; value: string[]; expiresAt?: number };
```

This is a TypeScript discriminated union: when we check the `type`, TypeScript already knows if the `value` is a `string` or a `string[]`.

- `STRING`: used by `SET`, `GET` and `INCR`. Even numbers are stored as strings, `INCR` converts, adds 1 and stores it back;
- `LIST`: used by `LPUSH`, `RPUSH`, `LRANGE`, `LINDEX`, `LLEN`, `LPOP` and `RPOP`. When a list becomes empty, the key is deleted, just like in Redis.

### WRONGTYPE

Since each key has a type, a command can't be used on a key of another type. For example, if `name` is a string, an `LPUSH name x` makes no sense. In this case, the command returns the error:

```
-WRONGTYPE Operation against a key holding the wrong kind of value
```

Every command follows the same pattern: it looks up the key, and if it exists but has the wrong type, it returns `WRONGTYPE`:

```ts
const entry = getEntry(key);

if (entry === undefined) return NULL_BULK;

if (entry.type !== EntryType.STRING) return WRONGTYPE;

return bulkString(entry.value);
```
