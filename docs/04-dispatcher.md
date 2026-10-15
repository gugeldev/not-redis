**English** | [Português](04-dispatcher-pt-BR.md)

# Dispatcher

After the parser turns the bytes into a command (ex: `["GET", "name"]`), something needs to decide which code will run for that command. That's the dispatcher's job, which lives in `src/execute`.

### Command table

Instead of a giant `if`/`switch` with every command, we use a table: an object where the key is the command name and the value is the function that executes it (in `src/commands/index.ts`):

```ts
export const commands: Record<string, CommandSpec> = {
	GET: { run: executeGet, arity: 2 },
	SET: { run: executeSet, arity: -3 },
	DEL: { run: executeDel, arity: -2 },
	// ...
};
```

This way, the dispatcher only needs to take the command name, uppercase it (Redis accepts `get`, `GET` or `Get`) and look it up in the table. If it's not found, it returns an `ERR unknown command` error. To add a new command, we just create the function and register it in the table, without touching the dispatcher.

### Arity

Arity is the number of arguments a command accepts, counting the command name itself (just like Redis). It can be:

- Positive: the command needs **exactly** that amount. Ex: `GET: 2` only accepts `GET key`;
- Negative: the command needs **at least** that amount. Ex: `DEL: -2` accepts `DEL a`, `DEL a b c`, etc.

The sign is just a way to store two pieces of information in one number: the value says the minimum and the sign says if it can have more.

The dispatcher validates the arity before running the command:

```ts
const argsTotal = args.length + 1;
const ok = arity >= 0 ? argsTotal === arity : argsTotal >= -arity;
```

The `-arity` just removes the sign from the negative number: for `DEL`, `-(-2)` becomes `2`, so the check becomes "at least 2".

Since this validation lives in a single place, commands don't need to check if the arguments exist, they already receive everything in the right format. Redis does the same: the arity is checked before calling the command.
