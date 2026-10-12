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
import { executePing } from "./execute-ping";
import { executeRpop } from "./execute-rpop";
import { executeRpush } from "./execute-rpush";
import { executeSet } from "./execute-set";
import { executeTtl } from "./execute-ttl";

export type Args = string[];

export type Command = (args: Args) => string;

export type CommandSpec = { run: Command; arity: number };

export const commands: Record<string, CommandSpec> = {
	EXPIRE: { run: executeExpire, arity: 3 },
	EXISTS: { run: executeExists, arity: -2 },
	LRANGE: { run: executeLrange, arity: 4 },
	LINDEX: { run: executeLindex, arity: 3 },
	RPUSH: { run: executeRpush, arity: -3 },
	LPUSH: { run: executeLpush, arity: -3 },
	RPOP: { run: executeRpop, arity: 2 },
	LPOP: { run: executeLpop, arity: 2 },
	LLEN: { run: executeLlen, arity: 2 },
	HELLO: { run: executeHello, arity: -1 },
	PING: { run: executePing, arity: -1 },
	ECHO: { run: executeEcho, arity: 2 },
	INCR: { run: executeIncr, arity: 2 },
	SET: { run: executeSet, arity: -3 },
	GET: { run: executeGet, arity: 2 },
	TTL: { run: executeTtl, arity: 2 },
	DEL: { run: executeDel, arity: -2 },
};
