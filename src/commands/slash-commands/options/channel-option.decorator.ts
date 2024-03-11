import { ApplicationCommandOptionType, APIApplicationCommandChannelOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

/**
 * Param decorator that marks a method as a channel option.
 * @param options The channel options.
 * @returns The decorated method.
 * @url https://necord.org/interactions/slash-commands#options
 */
export const ChannelOption = createOptionDecorator<APIApplicationCommandChannelOption>(
	ApplicationCommandOptionType.Channel,
	'getChannel'
);
