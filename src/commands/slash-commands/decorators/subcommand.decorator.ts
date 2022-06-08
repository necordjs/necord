import { SetMetadata } from '@nestjs/common';
import { SlashCommandMeta } from '../slash-command.discovery';
import { SLASH_SUBCOMMANDS_METADATA } from '../../../necord.constants';
import { ApplicationCommandOptionType } from 'discord.js';

export const Subcommand = (options: Omit<SlashCommandMeta, 'type'>): MethodDecorator =>
	SetMetadata<string, SlashCommandMeta>(SLASH_SUBCOMMANDS_METADATA, {
		type: ApplicationCommandOptionType.Subcommand,
		...options
	});
