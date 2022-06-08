import { SetMetadata } from '@nestjs/common';
import { SlashCommandMeta } from '../slash-command.discovery';
import { SLASH_COMMAND_METADATA } from '../../../necord.constants';
import { ApplicationCommandType } from 'discord.js';

export const SlashCommand = (options: Omit<SlashCommandMeta, 'type'>): MethodDecorator =>
	SetMetadata<string, SlashCommandMeta>(SLASH_COMMAND_METADATA, {
		type: ApplicationCommandType.ChatInput,
		...options
	});
