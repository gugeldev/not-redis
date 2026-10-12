import { simpleString } from "../resp";
import type { Command } from ".";

export const executeHello: Command = () => simpleString("OK");
