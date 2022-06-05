import { applyDecorators, SetMetadata, Type, UseInterceptors } from '@nestjs/common';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from 'discord.js';
import { AUTOCOMPLETE_METADATA } from '../../necord.constants';
import { AutocompleteInterceptor } from './autocomplete.interceptor';

export interface TransformOptions {
	transformOptions(
		interaction: AutocompleteInteraction,
		focused: ApplicationCommandOptionChoiceData
	): ApplicationCommandOptionChoiceData[] | Promise<ApplicationCommandOptionChoiceData[]>;
}

export type AutocompleteMeta = Type<TransformOptions>[];

export const Autocomplete = (...autocompletes: AutocompleteMeta): MethodDecorator =>
	applyDecorators(
		SetMetadata<string, AutocompleteMeta>(AUTOCOMPLETE_METADATA, autocompletes),
		UseInterceptors(AutocompleteInterceptor)
	);
