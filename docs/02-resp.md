**English** | [Português](02-resp-pt-BR.md)

# RESP

RESP is the protocol Redis uses for communication between client and server. It is responsible for standardizing what the client sends and what the server returns.

### What the client sends

The rule Redis follows is that the client always sends an array of **bulk strings**. For every command, the format is always the same.

> Bulk string: a string that tells its size up front. Ex: `$4\r\nJoao\r\n`, the `4` says it's a 4 byte string: `Joao` -> 1 byte (8 bits) per letter, since these are letters without accents.

Example of a command the client sends:

`*3\r\n$3\r\nSET\r\n$4\r\nname\r\n$4\r\nJoao\r\n`

- `*3\r\n` -> The array has 3 parts
- `$3\r\n` -> The next part has 3 bytes
- `SET\r\n` -> SET = 3 letters = 3 bytes
- `$4\r\n` -> The next part has 4 bytes
- `name\r\n` -> name = 4 letters = 4 bytes
- `$4\r\n` -> The next part has 4 bytes
- `Joao\r\n` -> Joao = 4 letters = 4 bytes

### What the server returns

The client always sends the same format (an array of **bulk strings**), but the server's response changes depending on the command. The first character of the response tells its type:

| Type | Example | Used by in not-redis |
|---|---|---|
| Simple string | `+OK\r\n` | `SET`, `PING` |
| Error | `-ERR ...\r\n` | `WRONGTYPE`, wrong arity |
| Integer | `:3\r\n` | `INCR`, `LLEN`, `DEL`, `TTL` |
| Bulk string | `$4\r\nJoao\r\n` | `GET`, `LPOP`, `ECHO` |
| Null | `$-1\r\n` | `GET` on a key that doesn't exist |
| Array | `*2\r\n$1\r\na\r\n$1\r\nb\r\n` | `LRANGE` |

In not-redis, each type has a helper in `src/resp` (`simpleString`, `error`, `integer`, `bulkString`, `NULL_BULK` and `array`), so commands don't need to build these strings by hand.
