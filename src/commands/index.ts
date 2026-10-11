export type Args = string[];

export type Command = (args: Args) => string;

const store = new Map<string, string>();

export const commands: Record<string, Command> = {
  HELLO: (args: Args) => executeHello(args),
  PING: (args: Args) => executePing(args),
  ECHO: (args: Args) => executeEcho(args),
  SET: (args: Args) => executeSet(args),
  GET: (args: Args) => executeGet(args)
};

const executeHello: Command = () => `+OK\r\n`;

const executePing: Command = () => `+PONG\r\n`;

const executeEcho: Command = (args) => {
  const value = args[0];

  if (value === undefined)
    return `-ERR wrong number of arguments for 'echo' command\r\n`;

  const bytesLenght = Buffer.byteLength(value);

  return `$${bytesLenght}\r\n${value}\r\n`;
}

const executeSet: Command = (args) => {
  const key = args[0];
  const value = args[1];

  if (key === undefined || value === undefined)
    return `-ERR wrong number of arguments for 'set' command\r\n`;

  store.set(key, value);

  return `+OK\r\n`;
}

const executeGet: Command = (args) => {
  const key = args[0];

  if (key === undefined)
    return `-ERR wrong number of arguments for 'get' command\r\n`;

  const value = store.get(key);

  if (value === undefined)
    return `$-1\r\n`;

  const bytesLenght = Buffer.byteLength(value);

  return `$${bytesLenght}\r\n${value}\r\n`
}
