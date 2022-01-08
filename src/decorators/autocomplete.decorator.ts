import { SetMetadata, Type } from '@nestjs/common';
import { AUTOCOMPLETE_METADATA } from '../necord.constants';
import { ApplicationCommandOptionChoice, AutocompleteInteraction } from 'discord.js';
import { TransformOptions } from '../interfaces';

export const Autocomplete = (autocomplete: Type<TransformOptions>): MethodDecorator =>
	SetMetadata(AUTOCOMPLETE_METADATA, autocomplete);
