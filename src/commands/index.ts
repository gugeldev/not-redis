import { executeDel } from "./execute-del";
import { executeEcho } from "./execute-echo";
import { executeExists } from "./execute-exists";
import { executeExpire } from "./execute-expire";
import { executeGet } from "./execute-get";
import { executeHello } from "./execute-hello";
import { executeIncr } from "./execute-incr";
import { executePing } from "./execute-ping";
import { executeSet } from "./execute-set";
import { executeTtl } from "./execute-ttl";

export type Args = string[];

export type Command = (args: Args) => string;

export const commands: Record<string, Command> = {
	EXPIRE: executeExpire,
	EXISTS: executeExists,
	HELLO: executeHello,
	PING: executePing,
	ECHO: executeEcho,
	INCR: executeIncr,
	SET: executeSet,
	GET: executeGet,
	TTL: executeTtl,
	DEL: executeDel,
};
