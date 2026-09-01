import { ApplicationCommandOptionType, APIApplicationCommandRoleOption } from 'discord.js';

import { createOptionDecorator } from './option.util.js';

/**
 * Param decorator that marks a method as a role option.
 * @param options The role options.
 * @returns The decorated method.
 * @url https://necord.org/interactions/slash-commands#options
 */
export const RoleOption = createOptionDecorator<APIApplicationCommandRoleOption>(
	ApplicationCommandOptionType.Role,
	'getRole'
);
