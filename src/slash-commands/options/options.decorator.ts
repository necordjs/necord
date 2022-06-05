import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NecordExecutionContext } from '../../context';
import { SlashCommandContext } from '../../interfaces';
import { OPTIONS_METADATA } from '../../necord.constants';

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
			try {
				const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
				let prototype = Reflect.getPrototypeOf(new paramTypes[parameterIndex]());

				const options = {};

				for (
					;
					prototype !== Object.prototype;
					prototype = Reflect.getPrototypeOf(prototype)
				) {
					Object.getOwnPropertyNames(prototype)
						.map(name => [name, Reflect.getMetadata(OPTIONS_METADATA, prototype, name)])
						.filter(([, meta]) => !!meta)
						.forEach(([name, meta]) => (options[name] ??= meta));
				}

				Reflect.defineMetadata(OPTIONS_METADATA, options, target[propertyKey]);
			} catch (err) {
				// NO-OP
			}
		}
	]
);

export const Opts = Options;
