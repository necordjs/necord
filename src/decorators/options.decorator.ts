import { OptionMeta } from '../interfaces';
import { OPTIONS_METADATA } from '../necord.constants';
import { ApplicationCommandOptionType } from 'discord.js';
import {
	APIApplicationCommandAttachmentOption,
	APIApplicationCommandBooleanOption,
	APIApplicationCommandChannelOption,
	APIApplicationCommandIntegerOption,
	APIApplicationCommandMentionableOption,
	APIApplicationCommandNumberOption,
	APIApplicationCommandRoleOption,
	APIApplicationCommandStringOption,
	APIApplicationCommandUserOption
} from 'discord-api-types/v10';
import { APIApplicationCommandOptionBase } from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base';
import { DistributiveOmit } from 'discord-api-types/utils/internals';

export const BooleanOption = createNecordOptionDecorator<APIApplicationCommandBooleanOption>(
	ApplicationCommandOptionType.Boolean,
	'getBoolean'
);

export const IntegerOption = createNecordOptionDecorator<APIApplicationCommandIntegerOption>(
	ApplicationCommandOptionType.Integer,
	'getInteger'
);

export const NumberOption = createNecordOptionDecorator<APIApplicationCommandNumberOption>(
	ApplicationCommandOptionType.Number,
	'getNumber'
);

export const StringOption = createNecordOptionDecorator<APIApplicationCommandStringOption>(
	ApplicationCommandOptionType.String,
	'getString'
);

export const ChannelOption = createNecordOptionDecorator<APIApplicationCommandChannelOption>(
	ApplicationCommandOptionType.Channel,
	'getChannel'
);

export const UserOption = createNecordOptionDecorator<APIApplicationCommandUserOption>(
	ApplicationCommandOptionType.User,
	'getUser'
);

export const MemberOption = createNecordOptionDecorator<APIApplicationCommandUserOption>(
	ApplicationCommandOptionType.User,
	'getMember'
);

export const RoleOption = createNecordOptionDecorator<APIApplicationCommandRoleOption>(
	ApplicationCommandOptionType.Role,
	'getRole'
);

export const MentionableOption =
	createNecordOptionDecorator<APIApplicationCommandMentionableOption>(
		ApplicationCommandOptionType.Mentionable,
		'getMentionable'
	);

export const AttachmentOption = createNecordOptionDecorator<APIApplicationCommandAttachmentOption>(
	ApplicationCommandOptionType.Attachment,
	'getAttachment'
);

export function createNecordOptionDecorator<T extends APIApplicationCommandOptionBase<any>>(
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
