import { OptionMetadata } from '../../interfaces';
import { createNecordOption } from '../../utils';
import { SlashCommandMentionableOption } from '@discordjs/builders';

export const MentionableOption = (options: OptionMetadata) =>
	createNecordOption(
		resolver => resolver.getMentionable(options.name, !!options.required),
		new SlashCommandMentionableOption()
			.setName(options.name)
			.setDescription(options.description)
			.setRequired(!!options.required)
	);
