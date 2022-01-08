import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { OptionMetadata } from '../interfaces';
import { OPTIONS_METADATA } from '../necord.constants';

export const BooleanOption = createNecordOptionDecorator(
	ApplicationCommandOptionTypes.BOOLEAN,
	'getBoolean'
);

export const IntegerOption = createNecordOptionDecorator(
	ApplicationCommandOptionTypes.INTEGER,
	'getInteger'
);

export const NumberOption = createNecordOptionDecorator(
	ApplicationCommandOptionTypes.NUMBER,
	'getNumber'
);

export const StringOption = createNecordOptionDecorator(
	ApplicationCommandOptionTypes.STRING,
	'getString'
);

export const UserOption = createNecordOptionDecorator(
	ApplicationCommandOptionTypes.USER,
	'getUser'
);

export const MemberOption = createNecordOptionDecorator(
	ApplicationCommandOptionTypes.USER,
	'getMember'
);

export const ChannelOption = createNecordOptionDecorator(
	ApplicationCommandOptionTypes.USER,
	'getChannel'
);

export const RoleOption = createNecordOptionDecorator(
	ApplicationCommandOptionTypes.ROLE,
	'getRole'
);

export const MentionableOption = createNecordOptionDecorator(
	ApplicationCommandOptionTypes.MENTIONABLE,
	'getMentionable'
);

function createNecordOptionDecorator<
	T extends OptionMetadata['type'],
	C extends OptionMetadata<T> = OptionMetadata<T>
>(
	type: T,
	methodName: OptionMetadata['methodName']
): (data: Omit<C, 'type' | 'methodName'>) => PropertyDecorator {
	return (data: C): PropertyDecorator =>
		(target: object, propertyKey: string) => {
			const options: Record<string, C> =
				Reflect.getMetadata(OPTIONS_METADATA, target.constructor) ?? {};

			options[propertyKey] = {
				...data,
				type,
				methodName
			};

			Reflect.defineMetadata(OPTIONS_METADATA, options, target.constructor);
		};
}
