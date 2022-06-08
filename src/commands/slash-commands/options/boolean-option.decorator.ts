import { APIApplicationCommandBooleanOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const BooleanOption = createOptionDecorator<APIApplicationCommandBooleanOption>(
	ApplicationCommandOptionType.Boolean,
	'getBoolean'
);
