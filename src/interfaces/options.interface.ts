import {
	ApplicationCommandAutocompleteOption,
	ApplicationCommandChannelOptionData,
	ApplicationCommandChoicesData,
	ApplicationCommandNonOptionsData,
	ApplicationCommandNumericOptionData,
	CommandInteractionOptionResolver
} from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';

type ExcludeType<T> = Omit<T, 'type'>;

type ExcludeTypeAndAutocomplete<T> = Omit<ExcludeType<T>, 'autocomplete'>;

type ChoicesOptionsData = ExcludeType<ApplicationCommandChoicesData>;

type AutocompleteOptionsData = ExcludeType<ApplicationCommandAutocompleteOption>;

type NonChoiceOptionsData = ExcludeType<ApplicationCommandNonOptionsData>;

type SharedOptionData<T> = T & {
	index?: number;
};

export type BooleanOptionData = SharedOptionData<NonChoiceOptionsData>;

export type StringOptionData = SharedOptionData<ChoicesOptionsData | AutocompleteOptionsData>;

export type NumericOptionData = SharedOptionData<
	| ChoicesOptionsData
	| AutocompleteOptionsData
	| ExcludeTypeAndAutocomplete<ApplicationCommandNumericOptionData>
>;

export type ChannelOptionData = SharedOptionData<ExcludeType<ApplicationCommandChannelOptionData>>;

export type DiscordOptionData = SharedOptionData<NonChoiceOptionsData>;

export type CommandOptionData = SharedOptionData<
	StringOptionData | NumericOptionData | ChannelOptionData | BooleanOptionData | DiscordOptionData
>;

export type OptionMeta = CommandOptionData & {
	type?: keyof typeof ApplicationCommandOptionTypes;
	resolver?: keyof CommandInteractionOptionResolver;
};
