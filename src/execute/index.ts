import { commands } from "../commands";
import { parse } from "../parse";

export const execute = (input: string) => {
  const [name, ...args] = parse(input);
  const command = name ? commands[name.toUpperCase()] : undefined;

  if (!command) return `-ERR unknown command '${name}'\r\n`;

  const response = command(args);

  console.log(`< ${name} ${args.join(" ")}`);
  console.log(`> ${JSON.stringify(response)}`);

  return response;
}
