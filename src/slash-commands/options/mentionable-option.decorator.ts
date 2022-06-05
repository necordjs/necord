import { APIApplicationCommandMentionableOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const MentionableOption = createOptionDecorator<APIApplicationCommandMentionableOption>(
	ApplicationCommandOptionType.Mentionable,
	'getMentionable'
);
