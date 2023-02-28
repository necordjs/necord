import { applyDecorators, SetMetadata } from '@nestjs/common';
import { SUBCOMMAND_GROUP_METADATA } from '../../../necord.constants';
import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommandDiscovery, SlashCommandMeta } from '../slash-command.discovery';
import { SlashCommand } from './slash-command.decorator';
import { noop } from 'rxjs';

const SubcommandGroup = (options?: Omit<SlashCommandMeta, 'type' | 'options' | 'guilds'>) =>
	SetMetadata(
		SUBCOMMAND_GROUP_METADATA,
		new SlashCommandDiscovery({
			type: ApplicationCommandOptionType.SubcommandGroup,
			...options
		})
	);

export const createCommandGroupDecorator = (rootOptions: Omit<SlashCommandMeta, 'type'>) => {
	const rootCommand = SlashCommand(rootOptions);

	return (subOptions?: Omit<SlashCommandMeta, 'type'>): ClassDecorator => {
		const subCommandGroup = subOptions ? SubcommandGroup(subOptions) : noop;

		return applyDecorators(rootCommand, subCommandGroup);
	};
};
