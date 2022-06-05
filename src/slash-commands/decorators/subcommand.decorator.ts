import { SetMetadata } from '@nestjs/common';
import { SlashCommandMeta } from '../slash-command.discovery';
import { SLASH_SUBCOMMANDS_METADATA } from '../../necord.constants';
import { ApplicationCommandType } from 'discord.js';

export const Subcommand = (name: string, description: string): MethodDecorator =>
	SetMetadata<string, SlashCommandMeta>(SLASH_SUBCOMMANDS_METADATA, {
		type: ApplicationCommandType.ChatInput,
		name,
		description,
		options: []
	});
