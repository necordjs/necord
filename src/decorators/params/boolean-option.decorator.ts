import { OptionMetadata } from '../../interfaces';
import { createNecordOption } from '../../utils';
import { SlashCommandBooleanOption } from '@discordjs/builders';

export const BooleanOption = (options: OptionMetadata) =>
	createNecordOption(
		resolver => resolver.getBoolean(options.name, !!options.required),
		new SlashCommandBooleanOption()
			.setName(options.name)
			.setDescription(options.description)
			.setRequired(!!options.required)
	);
