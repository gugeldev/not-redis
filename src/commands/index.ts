import { executeDel } from "./execute-del";
import { executeEcho } from "./execute-echo";
import { executeExists } from "./execute-exists";
import { executeExpire } from "./execute-expire";
import { executeGet } from "./execute-get";
import { executeHello } from "./execute-hello";
import { executeIncr } from "./execute-incr";
import { executeLindex } from "./execute-lindex";
import { executeLlen } from "./execute-llen";
import { executeLpop } from "./execute-lpop";
import { executeLpush } from "./execute-lpush";
import { executeLrange } from "./execute-lrange";
import { executePexpireat } from "./execute-pexpireat";
import { executePing } from "./execute-ping";
import { executeRpop } from "./execute-rpop";
import { executeRpush } from "./execute-rpush";
import { executeSet } from "./execute-set";
import { executeTtl } from "./execute-ttl";

export type Args = string[];

export type Command = (args: Args) => string;

export type CommandSpec = { run: Command; arity: number; write?: boolean };

export const commands: Record<string, CommandSpec> = {
	PEXPIREAT: { run: executePexpireat, arity: 3, write: true },
	EXPIRE: { run: executeExpire, arity: 3, write: true },
	EXISTS: { run: executeExists, arity: -2 },
	LRANGE: { run: executeLrange, arity: 4 },
	LINDEX: { run: executeLindex, arity: 3 },
	RPUSH: { run: executeRpush, arity: -3, write: true },
	LPUSH: { run: executeLpush, arity: -3, write: true },
	RPOP: { run: executeRpop, arity: 2, write: true },
	LPOP: { run: executeLpop, arity: 2, write: true },
	LLEN: { run: executeLlen, arity: 2 },
	HELLO: { run: executeHello, arity: -1 },
	PING: { run: executePing, arity: -1 },
	ECHO: { run: executeEcho, arity: 2 },
	INCR: { run: executeIncr, arity: 2, write: true },
	SET: { run: executeSet, arity: -3, write: true },
	GET: { run: executeGet, arity: 2 },
	TTL: { run: executeTtl, arity: 2 },
	DEL: { run: executeDel, arity: -2, write: true },
};
