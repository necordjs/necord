import { APIApplicationCommandRoleOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const RoleOption = createOptionDecorator<APIApplicationCommandRoleOption>(
	ApplicationCommandOptionType.Role,
	'getRole'
);
