import { ApplicationCommandOptionType, APIApplicationCommandRoleOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const RoleOption = createOptionDecorator<APIApplicationCommandRoleOption>(
	ApplicationCommandOptionType.Role,
	'getRole'
);
