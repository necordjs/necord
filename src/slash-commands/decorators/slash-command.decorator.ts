import { SetMetadata } from '@nestjs/common';
import { SlashCommandMeta } from '../slash-command.discovery';
import { SLASH_COMMAND_METADATA } from '../../necord.constants';
import { ApplicationCommandType } from 'discord.js';

export const SlashCommand = (name: string, description: string): MethodDecorator =>
	SetMetadata<string, SlashCommandMeta>(SLASH_COMMAND_METADATA, {
		type: ApplicationCommandType.ChatInput,
		name,
		description,
		options: []
	});
