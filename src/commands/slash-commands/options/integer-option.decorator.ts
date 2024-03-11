import { ApplicationCommandOptionType, APIApplicationCommandIntegerOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

/**
 * Param decorator that marks a method as an integer option.
 * @param options The integer options.
 * @returns The decorated method.
 * @url https://necord.org/interactions/slash-commands#options
 */
export const IntegerOption = createOptionDecorator<APIApplicationCommandIntegerOption>(
	ApplicationCommandOptionType.Integer,
	'getInteger'
);
