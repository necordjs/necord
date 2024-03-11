import { ApplicationCommandOptionType, APIApplicationCommandUserOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

/**
 * Param decorator that marks a method as a member option.
 * @param options The member options.
 * @returns The decorated method.
 * @url https://necord.org/interactions/slash-commands#options
 */
export const MemberOption = createOptionDecorator<APIApplicationCommandUserOption>(
	ApplicationCommandOptionType.User,
	'getMember'
);
