import {
	ApplicationCommandAutocompleteOption,
	ApplicationCommandChannelOptionData,
	ApplicationCommandChoicesData,
	ApplicationCommandNonOptionsData,
	ApplicationCommandNumericOptionData,
	CommandInteractionOptionResolver
} from 'discord.js';

export type CommandOptionData =
	| ApplicationCommandChoicesData
	| ApplicationCommandNonOptionsData
	| ApplicationCommandChannelOptionData
	| ApplicationCommandAutocompleteOption
	| ApplicationCommandNumericOptionData;

export type OptionMeta<T = any> = CommandOptionData & {
	type: T;
	index?: number;
	resolver?: keyof CommandInteractionOptionResolver;
};
