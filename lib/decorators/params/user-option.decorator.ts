import { SlashCommandUserOption } from '@discordjs/builders';
import { createNecordOption } from '../../utils';
import { OptionMetadata } from '../../interfaces';

export const UserOption = (options: OptionMetadata) =>
	createNecordOption(
		resolver => resolver.getUser(options.name, !!options.required),
		new SlashCommandUserOption()
			.setName(options.name)
			.setDescription(options.description)
			.setRequired(!!options.required)
	);
