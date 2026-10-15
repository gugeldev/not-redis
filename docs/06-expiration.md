**English** | [Português](06-expiration-pt-BR.md)

# Expiration

Redis lets a key have an expiration time, after which the key stops existing. It's widely used for cache and temporary data. In not-redis, you can set this time with `SET key value EX seconds` or with `EXPIRE key seconds`, and check how much is left with `TTL key`.

### How we store the expiration

Each `Entry` in the store has an optional `expiresAt` field, which is the exact moment (in milliseconds, just like `Date.now()`) when the key expires:

```ts
entry.expiresAt = Date.now() + seconds * 1000;
```

Storing the exact moment, and not "10 seconds left", makes everything easier: to know if it expired, we just compare it with `Date.now()`.

`TTL` uses this same field and returns:

- `-2`: the key doesn't exist (or already expired);
- `-1`: the key exists, but has no expiration;
- Any other number: how many seconds are left.

### Lazy expiration

But who deletes the key when the time runs out? In not-redis, nobody deletes it right away. The key is only deleted when someone tries to access it, this is called **lazy expiration**. Every command looks up keys through `getEntry`, which does this check:

```ts
if (entry.expiresAt !== undefined && Date.now() >= entry.expiresAt) {
	store.delete(key);
	return undefined;
}
```

This way, for whoever is using it, an expired key behaves exactly like a key that doesn't exist.

### The problem and active expiration

Lazy expiration has a problem: if nobody ever accesses an expired key again, it keeps taking up memory forever.

That's why Redis uses both together. Besides lazy, it has **active expiration**: a few times per second, it takes a random sample of keys with an expiration and deletes the ones that already expired. If many keys in the sample were expired, it repeats, because there are probably more.
