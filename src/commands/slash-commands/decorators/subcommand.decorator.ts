import { SlashCommandDiscovery, SubcommandMeta } from '../slash-command.discovery';
import { ApplicationCommandOptionType, SlashCommandSubcommandBuilder } from 'discord.js';
import { Reflector } from '@nestjs/core';

/**
 * Decorator that marks a method as a subcommand.
 * @param options The subcommand options.
 * @returns The decorated method.
 * @see SlashCommandDiscovery
 * @url https://necord.org/interactions/slash-commands#groups
 */
export const Subcommand = Reflector.createDecorator<
	Omit<SubcommandMeta, 'type' | 'options' | 'autocomplete'>,
	SlashCommandDiscovery
>({
	transform: options =>
		new SlashCommandDiscovery({
			type: ApplicationCommandOptionType.Subcommand,
			...options
		})
});
