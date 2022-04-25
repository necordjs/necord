import {
	BooleanOptionData,
	ChannelOptionData,
	CommandOptionData,
	DiscordOptionData,
	NumericOptionData,
	OptionMeta,
	StringOptionData
} from '../interfaces';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { OPTIONS_METADATA } from '../necord.constants';

export const BooleanOption = createNecordOptionDecorator<BooleanOptionData>(
	'BOOLEAN',
	'getBoolean'
);

export const IntegerOption = createNecordOptionDecorator<NumericOptionData>(
	'INTEGER',
	'getInteger'
);

export const NumberOption = createNecordOptionDecorator<NumericOptionData>('NUMBER', 'getNumber');

export const StringOption = createNecordOptionDecorator<StringOptionData>('STRING', 'getString');

export const ChannelOption = createNecordOptionDecorator<ChannelOptionData>(
	'CHANNEL',
	'getChannel'
);

export const UserOption = createNecordOptionDecorator<DiscordOptionData>('USER', 'getUser');

export const MemberOption = createNecordOptionDecorator<DiscordOptionData>('USER', 'getMember');

export const RoleOption = createNecordOptionDecorator<DiscordOptionData>('ROLE', 'getRole');

export const MentionableOption = createNecordOptionDecorator<DiscordOptionData>(
	'MENTIONABLE',
	'getMentionable'
);

export function createNecordOptionDecorator<T extends CommandOptionData>(
	type: keyof typeof ApplicationCommandOptionTypes,
	resolver: OptionMeta['resolver']
) {
	return (data: T): PropertyDecorator => {
		return (target: any, propertyKey: string | symbol) => {
			Reflect.defineProperty(target, propertyKey, {
				value: undefined,
				writable: true,
				configurable: true
			});

			Reflect.defineMetadata(
				OPTIONS_METADATA,
				{
					...data,
					type,
					resolver
				},
				target,
				propertyKey
			);
		};
	};
}
