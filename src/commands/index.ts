import { executeEcho } from "./echo";
import { executeGet } from "./get";
import { executeHello } from "./hello";
import { executePing } from "./ping";
import { executeSet } from "./set";

export type Args = string[];

export type Command = (args: Args) => string;

export const commands: Record<string, Command> = {
	HELLO: executeHello,
	PING: executePing,
	ECHO: executeEcho,
	SET: executeSet,
	GET: executeGet,
};
