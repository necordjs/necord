import { ApplicationCommandOptionType, APIApplicationCommandUserOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

/**
 * Param decorator that marks a method as a user option.
 * @param options The user options.
 * @returns The decorated method.
 * @url https://necord.org/interactions/slash-commands#options
 */
export const UserOption = createOptionDecorator<APIApplicationCommandUserOption>(
	ApplicationCommandOptionType.User,
	'getUser'
);
