import { OPTIONS_METADATA } from '../../index';
import {
	ApplicationCommandOptionData,
	ApplicationCommandSubCommandData,
	ApplicationCommandSubGroupData,
	CommandInteractionOptionResolver
} from 'discord.js';

export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type CommandOptionData = Exclude<
	ApplicationCommandOptionData,
	ApplicationCommandSubCommandData | ApplicationCommandSubGroupData
>;

export type OptionMeta<T extends CommandOptionData['type'] = any> = Extract<
	CommandOptionData & { type: T },
	ApplicationCommandOptionData
> & {
	methodName?: keyof CommandInteractionOptionResolver;
};

export const BooleanOption = createNecordOptionDecorator('BOOLEAN', 'getBoolean');

export const IntegerOption = createNecordOptionDecorator('INTEGER', 'getInteger');

export const NumberOption = createNecordOptionDecorator('NUMBER', 'getNumber');

export const StringOption = createNecordOptionDecorator('STRING', 'getString');

export const UserOption = createNecordOptionDecorator('USER', 'getUser');

export const MemberOption = createNecordOptionDecorator('USER', 'getMember');

export const ChannelOption = createNecordOptionDecorator('CHANNEL', 'getChannel');

export const RoleOption = createNecordOptionDecorator('ROLE', 'getRole');

export const MentionableOption = createNecordOptionDecorator('MENTIONABLE', 'getMentionable');

function createNecordOptionDecorator<T extends CommandOptionData['type']>(
	type: T,
	methodName: OptionMeta['methodName']
) {
	return (data: DistributiveOmit<OptionMeta<T>, 'type' | 'methodName'>): PropertyDecorator => {
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
