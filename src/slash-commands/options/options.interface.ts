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
