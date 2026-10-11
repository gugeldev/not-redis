import { executeDel } from "./del";
import { executeEcho } from "./echo";
import { executeExists } from "./exists";
import { executeGet } from "./get";
import { executeHello } from "./hello";
import { executePing } from "./ping";
import { executeSet } from "./set";
import { executeTtl } from "./ttl";

export type Args = string[];

export type Command = (args: Args) => string;

export const commands: Record<string, Command> = {
	EXISTS: executeExists,
	HELLO: executeHello,
	PING: executePing,
	ECHO: executeEcho,
	SET: executeSet,
	GET: executeGet,
	TTL: executeTtl,
	DEL: executeDel,
};
