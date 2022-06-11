import { ApplicationCommandOptionType, APIApplicationCommandBooleanOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const BooleanOption = createOptionDecorator<APIApplicationCommandBooleanOption>(
	ApplicationCommandOptionType.Boolean,
	'getBoolean'
);
