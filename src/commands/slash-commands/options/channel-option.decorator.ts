import { APIApplicationCommandChannelOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const ChannelOption = createOptionDecorator<APIApplicationCommandChannelOption>(
	ApplicationCommandOptionType.Channel,
	'getChannel'
);
