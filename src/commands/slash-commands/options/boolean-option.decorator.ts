import { ApplicationCommandOptionType, APIApplicationCommandBooleanOption } from 'discord.js';

import { createOptionDecorator } from './option.util.js';

/**
 * Param decorator that marks a method as a boolean option.
 * @param options The boolean options.
 * @returns The decorated method.
 * @url https://necord.org/interactions/slash-commands#options
 */
export const BooleanOption = createOptionDecorator<APIApplicationCommandBooleanOption>(
	ApplicationCommandOptionType.Boolean,
	'getBoolean'
);
