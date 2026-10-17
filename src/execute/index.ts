import { commands } from "../commands";
import { error } from "../resp";
import { appendToAof } from "../writer";

export const execute = ([name, ...args]: string[], persist = true) => {
	const command = name ? commands[name.toUpperCase()] : undefined;

	if (!command) return error(`ERR unknown command '${name}'`);

	const { run, arity, write } = command;

	const argsTotal = args.length + 1;

	const ok = arity >= 0 ? argsTotal === arity : argsTotal >= -arity;

	if (!ok)
		return error(
			`ERR wrong number of arguments for '${name?.toLowerCase()}' command`,
		);

	const response = run(args);

	/**
	 * Replies starting with "-" are errors, so we ignore them.
	 */
	if (persist && write && !response.startsWith("-")) {
		appendToAof([name!, ...args]);
	}

	console.log(`< ${name} ${args.join(" ")}`);
	console.log(`> ${JSON.stringify(response)}`);

	return response;
};
