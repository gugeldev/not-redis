# not-redis

A Redis clone built from scratch with TypeScript and Bun. It speaks the RESP protocol, so any Redis client can connect to it.

## Supported commands

`PING`, `ECHO`, `SET` (with `EX`), `GET`, `HELLO`, `TTL`, `EXISTS`, `DEL`, `INCR`, `EXPIRE`, `RPUSH`, `LPUSH`, `LRANGE`, `RPOP`, `LLEN`, `LINDEX`.

## Getting started

```bash
bun install
bun run dev        # server listening on 127.0.0.1:7777
```

## Try it

With a real Redis client (Bun.redis):

```bash
bun run client
```

Or sending raw RESP:

```bash
printf '*1\r\n$4\r\nPING\r\n' | nc -q1 127.0.0.1 7777
# +PONG
```

## Tests

```bash
bun test
```
