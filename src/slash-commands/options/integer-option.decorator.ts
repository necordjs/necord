import { APIApplicationCommandIntegerOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const IntegerOption = createOptionDecorator<APIApplicationCommandIntegerOption>(
	ApplicationCommandOptionType.Integer,
	'getInteger'
);
