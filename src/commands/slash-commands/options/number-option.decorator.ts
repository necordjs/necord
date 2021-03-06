import { ApplicationCommandOptionType, APIApplicationCommandNumberOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const NumberOption = createOptionDecorator<APIApplicationCommandNumberOption>(
	ApplicationCommandOptionType.Number,
	'getNumber'
);
