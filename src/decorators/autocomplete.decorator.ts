import { SetMetadata, Type } from '@nestjs/common';
import { ApplicationCommandOptionChoice, AutocompleteInteraction } from 'discord.js';
import { AUTOCOMPLETE_METADATA } from '../necord.constants';

export interface TransformOptions {
	transformOptions(
		interaction: AutocompleteInteraction,
		focused: ApplicationCommandOptionChoice
	): ApplicationCommandOptionChoice[] | Promise<ApplicationCommandOptionChoice[]>;
}

export type AutocompleteMeta = Type<TransformOptions>[];

export const Autocomplete = (...autocompletes: AutocompleteMeta): MethodDecorator =>
	SetMetadata(AUTOCOMPLETE_METADATA, autocompletes);
