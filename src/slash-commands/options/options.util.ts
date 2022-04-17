import { CommandOptionData, OptionMeta } from './options.interface';
import { OPTIONS_METADATA } from './options.constants';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';

export function createNecordOptionDecorator<T extends CommandOptionData>(
	type: keyof typeof ApplicationCommandOptionTypes,
	methodName: OptionMeta['resolver']
) {
	return (data: T): PropertyDecorator => {
		return (target: any, propertyKey: string | symbol) => {
			Reflect.defineProperty(target, propertyKey, { value: undefined });

			Reflect.defineMetadata(
				OPTIONS_METADATA,
				{
					...data,
					type,
					methodName
				},
				target,
				propertyKey
			);
		};
	};
}
