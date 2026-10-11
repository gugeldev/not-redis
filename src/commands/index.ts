import { executeDel } from "./execute-del";
import { executeEcho } from "./execute-echo";
import { executeExists } from "./execute-exists";
import { executeExpire } from "./execute-expire";
import { executeGet } from "./execute-get";
import { executeHello } from "./execute-hello";
import { executeIncr } from "./execute-incr";
import { executeLpush } from "./execute-lpush";
import { executeLrange } from "./execute-lrange";
import { executePing } from "./execute-ping";
import { executeRpop } from "./execute-rpop";
import { executeRpush } from "./execute-rpush";
import { executeSet } from "./execute-set";
import { executeTtl } from "./execute-ttl";

export type Args = string[];

export type Command = (args: Args) => string;

export const commands: Record<string, Command> = {
	EXPIRE: executeExpire,
	EXISTS: executeExists,
	LRANGE: executeLrange,
	RPUSH: executeRpush,
	LPUSH: executeLpush,
	RPOP: executeRpop,
	HELLO: executeHello,
	PING: executePing,
	ECHO: executeEcho,
	INCR: executeIncr,
	SET: executeSet,
	GET: executeGet,
	TTL: executeTtl,
	DEL: executeDel,
};
