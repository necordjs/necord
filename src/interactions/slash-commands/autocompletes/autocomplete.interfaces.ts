import { ApplicationCommandOptionChoice, AutocompleteInteraction } from 'discord.js';
import { Type } from '@nestjs/common';

export interface TransformOptions {
	transformOptions(
		interaction: AutocompleteInteraction,
		focused: ApplicationCommandOptionChoice
	): ApplicationCommandOptionChoice[] | Promise<ApplicationCommandOptionChoice[]>;
}

export type AutocompleteMeta = Type<TransformOptions>[];
