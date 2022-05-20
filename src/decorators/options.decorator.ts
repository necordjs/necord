import { CommandOptionData, DistributiveOmit, OptionMetadata } from '../interfaces';
import { OPTIONS_METADATA } from '../necord.constants';

export const BooleanOption = createNecordOptionDecorator('BOOLEAN', 'getBoolean');

export const IntegerOption = createNecordOptionDecorator('INTEGER', 'getInteger');

export const NumberOption = createNecordOptionDecorator('NUMBER', 'getNumber');

export const StringOption = createNecordOptionDecorator('STRING', 'getString');

export const UserOption = createNecordOptionDecorator('USER', 'getUser');

export const MemberOption = createNecordOptionDecorator('USER', 'getMember');

export const ChannelOption = createNecordOptionDecorator('CHANNEL', 'getChannel');

export const RoleOption = createNecordOptionDecorator('ROLE', 'getRole');

export const MentionableOption = createNecordOptionDecorator('MENTIONABLE', 'getMentionable');

export const AttachmentOption = createNecordOptionDecorator('ATTACHMENT', 'getAttachment');

function createNecordOptionDecorator<T extends CommandOptionData['type']>(
	type: T,
	methodName: OptionMetadata['methodName']
) {
	return (data: DistributiveOmit<OptionMetadata<T>, 'type' | 'methodName'>): PropertyDecorator =>
		(target: object, propertyKey: string) => {
			const options = Reflect.getMetadata(OPTIONS_METADATA, target.constructor) ?? {};

			options[propertyKey] = {
				...data,
				type,
				methodName
			};

			Reflect.defineMetadata(OPTIONS_METADATA, options, target.constructor);
		};
}
