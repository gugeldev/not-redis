import { simpleString } from "../resp";
import type { Command } from ".";

export const executePing: Command = () => simpleString("PONG");
