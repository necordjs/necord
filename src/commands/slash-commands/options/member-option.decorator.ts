import { APIApplicationCommandUserOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const MemberOption = createOptionDecorator<APIApplicationCommandUserOption>(
	ApplicationCommandOptionType.User,
	'getMember'
);
