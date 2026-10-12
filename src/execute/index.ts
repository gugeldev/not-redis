import { commands } from "../commands";

export const execute = ([name, ...args]: string[]) => {
	const command = name ? commands[name.toUpperCase()] : undefined;

	if (!command) return `-ERR unknown command '${name}'\r\n`;

	const { run, arity } = command;

	const argsTotal = args.length + 1;

	const ok = arity >= 0 ? argsTotal === arity : argsTotal >= -arity;

	if (!ok)
		return `-ERR wrong number of arguments for '${name?.toLowerCase()}' command\r\n`;

	const response = run(args);

	console.log(`< ${name} ${args.join(" ")}`);
	console.log(`> ${JSON.stringify(response)}`);

	return response;
};
