import { APIApplicationCommandStringOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const StringOption = createOptionDecorator<APIApplicationCommandStringOption>(
	ApplicationCommandOptionType.String,
	'getString'
);
