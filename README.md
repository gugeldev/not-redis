## not-redis

`not-redis` is a simple Redis clone, built with TypeScript + Bun, that speaks the same Redis protocol (RESP). This means you can replace the original Redis with not-redis in any Redis client and everything will work the same (for the supported commands only).

> This is a simple copy, created to understand the main concepts behind Redis, not a complete version.

### Supported commands
`PING`, `ECHO`, `HELLO`, `SET` (with `EX`), `GET`, `DEL`, `EXISTS`, `INCR`, `EXPIRE`, `TTL`, `RPUSH`, `LPUSH`, `LRANGE`, `LINDEX`, `LLEN`, `LPOP`, `RPOP`.

Available commands:
- `PING`: Checks if not-redis is healthy;
- `ECHO`: Tests not-redis by returning the given message;
- `HELLO`: Handshake sent by Redis clients when they connect;
- `SET`: Creates (or overwrites) a record, optionally with an expiration (`EX`);
- `GET`: Returns the value of a record;
- `DEL`: Deletes one or more records;
- `EXISTS`: Counts how many of the given keys exist;
- `INCR`: Increments a numeric value by 1;
- `EXPIRE`: Sets an expiration time (in seconds) on a record;
- `TTL`: Returns how many seconds a record has left before expiring;
- `RPUSH`: Adds values to the end of a list;
- `LPUSH`: Adds values to the beginning of a list;
- `LRANGE`: Returns a range of items from a list;
- `LINDEX`: Returns the item at a given position in a list;
- `LLEN`: Returns the length of a list;
- `LPOP`: Removes and returns the first item of a list;
- `RPOP`: Removes and returns the last item of a list.

### How to run

1. Clone the `not-redis` repository:

```bash
git clone git@github.com:gugeldev/not-redis.git
```
2. Enter the directory and install the dependencies:
```bash
cd not-redis
bun install
```

3. Run not-redis (the default port is 7777):
```bash
PORT=6379 bun run main.ts # if PORT is not set, it defaults to 7777
```

4. Test not-redis with a Redis client (Bun example):
```typescript
import { RedisClient } from "bun";

const client = new RedisClient("redis://127.0.0.1:6379");

console.log(await client.set("name", "John")); // Return 'OK'
console.log(await client.get("name")); // Return 'John'

client.close();
```

### How it works

A command travels through: socket -> parser -> dispatcher -> command -> store -> response.

1. [TCP Server](docs/01-tcp.md): why TCP and how connections are handled
2. [RESP](docs/02-resp.md): the protocol Redis clients speak
3. [Parser](docs/03-parser.md): buffering and framing incoming bytes
4. [Dispatcher](docs/04-dispatcher.md): command table and arity
5. [Store](docs/05-store.md): data types and WRONGTYPE
6. [Expiration](docs/06-expiration.md): lazy vs active expiration
