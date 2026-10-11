import { store } from "../store";
import type { Command } from ".";

export const executeSet: Command = (args) => {
  const key = args[0];
  const value = args[1];

  if (key === undefined || value === undefined)
    return `-ERR wrong number of arguments for 'set' command\r\n`;

  store.set(key, value);

  return `+OK\r\n`;
}
