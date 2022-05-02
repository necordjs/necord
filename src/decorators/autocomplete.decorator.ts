import { SetMetadata, Type } from '@nestjs/common';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from 'discord.js';
import { AUTOCOMPLETE_METADATA } from '../necord.constants';

export interface TransformOptions {
	transformOptions(
		interaction: AutocompleteInteraction,
		focused: ApplicationCommandOptionChoiceData
	): ApplicationCommandOptionChoiceData[] | Promise<ApplicationCommandOptionChoiceData[]>;
}

export type AutocompleteMeta = Type<TransformOptions>[];

export const Autocomplete = (...autocompletes: AutocompleteMeta): MethodDecorator =>
	SetMetadata(AUTOCOMPLETE_METADATA, autocompletes);
