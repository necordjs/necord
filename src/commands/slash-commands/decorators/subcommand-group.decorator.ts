import { applyDecorators, SetMetadata } from '@nestjs/common';
import { SUBCOMMAND_GROUP_METADATA } from '../../../necord.constants';
import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommandDiscovery, SlashCommandMeta } from '../slash-command.discovery';
import { SlashCommand } from './slash-command.decorator';

const SubcommandGroup = (subOptions: Omit<SlashCommandMeta, 'type'>): ClassDecorator =>
	SetMetadata<string, SlashCommandDiscovery>(
		SUBCOMMAND_GROUP_METADATA,
		new SlashCommandDiscovery({
			type: ApplicationCommandOptionType.SubcommandGroup,
			...subOptions
		})
	);

export const createCommandGroup =
	(rootOptions: Omit<SlashCommandMeta, 'type'>) =>
	(subOptions?: Omit<SlashCommandMeta, 'type'>): ClassDecorator =>
		applyDecorators(SlashCommand(rootOptions), SubcommandGroup(subOptions));
