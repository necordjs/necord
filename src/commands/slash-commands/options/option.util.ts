import { APIApplicationCommandOptionBase } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord.js';
import { OptionMeta } from '../slash-command.discovery';

export const OPTIONS_METADATA = 'necord:options_meta';

export function createOptionDecorator<T extends APIApplicationCommandOptionBase<any>>(
	type: ApplicationCommandOptionType,
	resolver: OptionMeta['resolver']
) {
	return (data: Omit<T, 'type'>): PropertyDecorator => {
		return (target: any, propertyKey: string | symbol) => {
			let metadata: Record<string, OptionMeta> = Reflect.getOwnMetadata(
				OPTIONS_METADATA,
				target
			);

			if (!metadata) {
				metadata = {};
			}

			metadata[String(propertyKey)] = {
				...data,
				type,
				resolver
			};

			Reflect.defineMetadata(OPTIONS_METADATA, metadata, target);
		};
	};
}
