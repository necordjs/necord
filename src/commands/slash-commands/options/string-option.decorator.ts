import { ApplicationCommandOptionType, APIApplicationCommandStringOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const StringOption = createOptionDecorator<APIApplicationCommandStringOption>(
	ApplicationCommandOptionType.String,
	'getString'
);
