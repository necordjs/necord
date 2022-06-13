import { applyDecorators, SetMetadata } from '@nestjs/common';
import { SUBCOMMAND_GROUP_METADATA } from '../../../necord.constants';
import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommandDiscovery, SlashCommandMeta } from '../slash-command.discovery';
import { SlashCommand } from './slash-command.decorator';

export const createCommandGroupDecorator = (rootOptions: Omit<SlashCommandMeta, 'type'>) => {
	const rootCommand = SlashCommand(rootOptions);

	return (subOptions?: Omit<SlashCommandMeta, 'type'>): ClassDecorator =>
		applyDecorators(
			rootCommand,
			SetMetadata(
				SUBCOMMAND_GROUP_METADATA,
				subOptions
					? new SlashCommandDiscovery({
							type: ApplicationCommandOptionType.SubcommandGroup,
							...subOptions
					  })
					: null
			)
		);
};
