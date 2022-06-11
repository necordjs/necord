import { ApplicationCommandOptionType, APIApplicationCommandUserOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const UserOption = createOptionDecorator<APIApplicationCommandUserOption>(
	ApplicationCommandOptionType.User,
	'getUser'
);
