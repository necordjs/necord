import { ApplicationCommandOptionType, APIApplicationCommandIntegerOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const IntegerOption = createOptionDecorator<APIApplicationCommandIntegerOption>(
	ApplicationCommandOptionType.Integer,
	'getInteger'
);
