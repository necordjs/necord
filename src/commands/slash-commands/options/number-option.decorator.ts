import { ApplicationCommandOptionType, APIApplicationCommandNumberOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

/**
 * Param decorator that marks a method as a number option.
 * @param options The number options.
 * @returns The decorated method.
 * @url https://necord.org/interactions/slash-commands#options
 */
export const NumberOption = createOptionDecorator<APIApplicationCommandNumberOption>(
	ApplicationCommandOptionType.Number,
	'getNumber'
);
