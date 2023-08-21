import { APIApplicationCommandOptionBase } from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base';
import { ApplicationCommandOptionType } from 'discord.js';
import { OptionMeta } from '../slash-command.discovery';
import { DistributiveOmit } from 'discord-api-types/utils/internals';

export const OPTIONS_METADATA = 'necord:options_meta';

export function createOptionDecorator<T extends APIApplicationCommandOptionBase<any>>(
	type: ApplicationCommandOptionType,
	resolver: OptionMeta['resolver']
) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return (data: DistributiveOmit<T, 'type'>): PropertyDecorator => {
		return (target: any, propertyKey: string | symbol) => {
			Reflect.defineProperty(target, propertyKey, {
				value: undefined,
				writable: true,
				configurable: true
			});

			const meta: OptionMeta = {
				...data,
				type,
				resolver
			};

			Reflect.defineMetadata(OPTIONS_METADATA, meta, target, propertyKey);
		};
	};
}
