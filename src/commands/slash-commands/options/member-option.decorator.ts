import { ApplicationCommandOptionType, APIApplicationCommandUserOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const MemberOption = createOptionDecorator<APIApplicationCommandUserOption>(
	ApplicationCommandOptionType.User,
	'getMember'
);
