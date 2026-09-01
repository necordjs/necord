import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { NecordExecutionContext, SlashCommandContext } from '../../../context/index.js';
import { OPTIONS_METADATA } from './option.util.js';

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

		if (!interaction || !discovery.isSlashCommand()) return null;

		return Object.entries(discovery.getRawOptions()).reduce((acc, [parameter, option]) => {
			const resolver = option.resolver;

			if (!resolver) {
				return acc;
			}

			acc[parameter] = interaction.options[resolver].call(
				interaction.options,
				option.name,
				!!option.required
			);
			return acc;
		}, {});
	},
	[
		(target, propertyKey, parameterIndex) => {
			if (propertyKey === undefined) {
				return;
			}

			const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
			const paramType = paramTypes?.[parameterIndex];

			if (!paramType) {
				return;
			}

			let { prototype } = paramType;

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
