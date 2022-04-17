import {
	ApplicationCommandAutocompleteOption,
	ApplicationCommandChannelOptionData,
	ApplicationCommandChoicesData,
	ApplicationCommandNonOptionsData,
	ApplicationCommandNumericOptionData,
	CommandInteractionOptionResolver
} from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';

type ExcludeType<T extends { type: any }> = Omit<T, 'type'>;

type ChoicesOptionsData = ExcludeType<ApplicationCommandChoicesData>;

type AutocompleteOptionsData = ExcludeType<ApplicationCommandAutocompleteOption>;

type NonChoiceOptionsData = ExcludeType<ApplicationCommandNonOptionsData>;

type SharedOptionData<T> = T & {
	index?: number;
};

export type BooleanOptionData = NonChoiceOptionsData;

export type StringOptionData = ChoicesOptionsData | AutocompleteOptionsData;

export type NumericOptionData = StringOptionData & ExcludeType<ApplicationCommandNumericOptionData>;

export type ChannelOptionData = ExcludeType<ApplicationCommandChannelOptionData>;

export type DiscordOptionData = NonChoiceOptionsData;

export type CommandOptionData = SharedOptionData<
	StringOptionData | NumericOptionData | ChannelOptionData | BooleanOptionData | DiscordOptionData
>;

export type OptionMeta = CommandOptionData & {
	type?: keyof typeof ApplicationCommandOptionTypes;
	resolver?: keyof CommandInteractionOptionResolver;
};
