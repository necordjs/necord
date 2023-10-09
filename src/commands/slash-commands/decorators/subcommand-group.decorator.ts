import { applyDecorators } from '@nestjs/common';
import { ApplicationCommandOptionType } from 'discord.js';
import { SlashCommandDiscovery, SlashCommandMeta } from '../slash-command.discovery';
import { SlashCommand } from './slash-command.decorator';
import { noop } from 'rxjs';
import { Reflector } from '@nestjs/core';

export const SubcommandGroup = Reflector.createDecorator<
	Omit<SlashCommandMeta, 'type' | 'options' | 'guilds' | 'defaultMemberPermissions'>,
	SlashCommandDiscovery
>({
	transform: options =>
		new SlashCommandDiscovery({
			type: ApplicationCommandOptionType.SubcommandGroup,
			...options
		})
});

export const createCommandGroupDecorator = (rootOptions: Omit<SlashCommandMeta, 'type'>) => {
	const rootCommand = SlashCommand(rootOptions);

	return (subOptions?: Omit<SlashCommandMeta, 'type'>): ClassDecorator => {
		const subCommandGroup = subOptions ? SubcommandGroup(subOptions) : noop;

		return applyDecorators(rootCommand, subCommandGroup);
	};
};
