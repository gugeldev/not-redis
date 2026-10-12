import { commands } from "../commands";
import { error } from "../resp";

export const execute = ([name, ...args]: string[]) => {
	const command = name ? commands[name.toUpperCase()] : undefined;

	if (!command) return error(`ERR unknown command '${name}'`);

	const { run, arity } = command;

	const argsTotal = args.length + 1;

	const ok = arity >= 0 ? argsTotal === arity : argsTotal >= -arity;

	if (!ok)
		return error(
			`ERR wrong number of arguments for '${name?.toLowerCase()}' command`,
		);

	const response = run(args);

	console.log(`< ${name} ${args.join(" ")}`);
	console.log(`> ${JSON.stringify(response)}`);

	return response;
};
