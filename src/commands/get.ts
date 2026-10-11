import { store } from "../store";
import type { Command } from ".";

export const executeGet: Command = (args) => {
  const key = args[0];

  if (key === undefined)
    return `-ERR wrong number of arguments for 'get' command\r\n`;

  const value = store.get(key);

  if (value === undefined)
    return `$-1\r\n`;

  const bytesLength = Buffer.byteLength(value);

  return `$${bytesLength}\r\n${value}\r\n`
}
