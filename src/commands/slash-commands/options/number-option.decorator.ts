import { APIApplicationCommandNumberOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const NumberOption = createOptionDecorator<APIApplicationCommandNumberOption>(
	ApplicationCommandOptionType.Number,
	'getNumber'
);
