import {
	ApplicationCommandOptionData,
	ApplicationCommandSubCommandData,
	ApplicationCommandSubGroupData,
	CommandInteractionOptionResolver
} from 'discord.js';

export type OptionData = Exclude<
	ApplicationCommandOptionData,
	ApplicationCommandSubGroupData | ApplicationCommandSubCommandData
>;

export type OptionTransform = keyof CommandInteractionOptionResolver;

export type OptionMetadata<T extends OptionData['type'] = OptionData['type']> = OptionData & {
	readonly type?: T;
	methodName?: OptionTransform;
};
