import { applyDecorators } from '@nestjs/common';
import { ApplicationCommandOptionType } from 'discord.js';
import {
	RootCommandMeta,
	SlashCommandDiscovery,
	SubcommandGroupMeta
} from '../slash-command.discovery';
import { SlashCommand } from './slash-command.decorator';
import { noop } from 'rxjs';
import { Reflector } from '@nestjs/core';

/**
 * Decorator that marks a method as a subcommand.
 * @param options The subcommand options.
 * @returns The decorated method.
 * @see SlashCommandDiscovery
 * @url https://necord.org/interactions/slash-commands#groups
 */
export const SubcommandGroup = Reflector.createDecorator<
	Omit<SubcommandGroupMeta, 'type' | 'options'>,
	SlashCommandDiscovery
>({
	transform: options =>
		new SlashCommandDiscovery({
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [],
			...options
		})
});

/**
 * Factory that creates a decorator that marks a class as a slash command group.
 * @param rootOptions
 * @returns The decorator.
 * @see SlashCommand
 * @see SubcommandGroup
 * @url https://necord.org/interactions/slash-commands#groups
 */
export const createCommandGroupDecorator = (rootOptions: Omit<RootCommandMeta, 'type'>) => {
	const rootCommand = SlashCommand(rootOptions);

	return (subOptions?: Omit<SubcommandGroupMeta, 'type' | 'options'>): ClassDecorator => {
		const subCommandGroup = subOptions ? SubcommandGroup(subOptions) : noop;

		return applyDecorators(rootCommand, subCommandGroup);
	};
};
