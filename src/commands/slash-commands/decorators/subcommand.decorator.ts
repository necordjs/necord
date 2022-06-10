import { SetMetadata } from '@nestjs/common';
import { SlashCommandDiscovery, SlashCommandMeta } from '../slash-command.discovery';
import { SUBCOMMAND_METADATA } from '../../../necord.constants';
import { ApplicationCommandOptionType } from 'discord.js';

export const Subcommand = (options: Omit<SlashCommandMeta, 'type'>): MethodDecorator =>
	SetMetadata<string, SlashCommandDiscovery>(
		SUBCOMMAND_METADATA,
		new SlashCommandDiscovery({
			type: ApplicationCommandOptionType.Subcommand,
			...options
		})
	);
