import { executeHello } from "./hello";
import { executeEcho } from "./echo";
import { executePing } from "./ping";
import { executeSet } from "./set";
import { executeGet } from "./get";

export type Args = string[];

export type Command = (args: Args) => string;

export const commands: Record<string, Command> = {
  HELLO: executeHello,
  PING: executePing,
  ECHO: executeEcho,
  SET: executeSet,
  GET: executeGet
};
