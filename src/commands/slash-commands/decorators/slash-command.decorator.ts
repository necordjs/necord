import { SetMetadata } from '@nestjs/common';
import { SlashCommandDiscovery, SlashCommandMeta } from '../slash-command.discovery';
import { SLASH_COMMAND_METADATA } from '../../../necord.constants';
import { ApplicationCommandType, Snowflake } from 'discord.js';

type SlashCommandParams = Omit<SlashCommandMeta, 'type'> & {
	guilds?: Snowflake[];
};

export const SlashCommand = (options: SlashCommandParams): MethodDecorator =>
	SetMetadata<string, SlashCommandDiscovery>(
		SLASH_COMMAND_METADATA,
		new SlashCommandDiscovery({
			type: ApplicationCommandType.ChatInput,
			...options
		})
	);
