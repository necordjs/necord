import { ApplicationCommandOptionType, APIApplicationCommandChannelOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const ChannelOption = createOptionDecorator<APIApplicationCommandChannelOption>(
	ApplicationCommandOptionType.Channel,
	'getChannel'
);
