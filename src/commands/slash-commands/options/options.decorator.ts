import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NecordExecutionContext, SlashCommandContext } from '../../../context';
import { OPTIONS_METADATA } from './option.util';

/**
 * Options decorator that mark arguments as options.
 * This decorator is used to retrieve the options from a slash command.
 * @returns The decorated argument.
 * @url https://necord.org/interactions/slash-commands#options
 */
export const Options = createParamDecorator(
	(_, context: ExecutionContext) => {
		const necordContext = NecordExecutionContext.create(context);
		const [interaction] = necordContext.getContext<SlashCommandContext>();
		const discovery = necordContext.getDiscovery();

		if (!discovery.isSlashCommand()) return null;

		return Object.entries(discovery.getRawOptions()).reduce((acc, [parameter, option]) => {
			acc[parameter] = interaction.options[option.resolver].call(
				interaction.options,
				option.name,
				!!option.required
			);
			return acc;
		}, {});
	},
	[
		(target, propertyKey, parameterIndex) => {
			const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
			let { prototype } = paramTypes[parameterIndex];

			const options = {};

			do {
				const metadata = Reflect.getOwnMetadata(OPTIONS_METADATA, prototype);

				Object.assign(options, metadata);
			} while (
				(prototype = Reflect.getPrototypeOf(prototype)) &&
				prototype !== Object.prototype
			);

			Reflect.defineMetadata(OPTIONS_METADATA, options, target[propertyKey]);
		}
	]
);

export const Opts = Options;
