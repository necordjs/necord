import { ApplicationCommandOptionType, APIApplicationCommandMentionableOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const MentionableOption = createOptionDecorator<APIApplicationCommandMentionableOption>(
	ApplicationCommandOptionType.Mentionable,
	'getMentionable'
);
