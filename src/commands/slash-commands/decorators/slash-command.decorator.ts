import { SetMetadata } from '@nestjs/common';
import { SlashCommandDiscovery, SlashCommandMeta } from '../slash-command.discovery';
import { SLASH_COMMAND_METADATA } from '../../../necord.constants';
import { ApplicationCommandType } from 'discord.js';

export const SlashCommand = (
	options: Omit<SlashCommandMeta, 'type' | 'options'>
): MethodDecorator =>
	SetMetadata<string, SlashCommandDiscovery>(
		SLASH_COMMAND_METADATA,
		new SlashCommandDiscovery({
			type: ApplicationCommandType.ChatInput,
			...options
		})
	);
