import { commands } from "../commands";

export const execute = ([name, ...args]: string[]) => {
	const command = name ? commands[name.toUpperCase()] : undefined;

	if (!command) return `-ERR unknown command '${name}'\r\n`;

	const response = command(args);

	console.log(`< ${name} ${args.join(" ")}`);
	console.log(`> ${JSON.stringify(response)}`);

	return response;
};
