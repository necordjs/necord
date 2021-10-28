import { OptionMetadata } from '../../interfaces';
import { createNecordOption } from '../../utils';
import { SlashCommandUserOption } from '@discordjs/builders';

export const MemberOption = (options: OptionMetadata) =>
	createNecordOption(
		resolver => resolver.getMember(options.name, !!options.required),
		new SlashCommandUserOption()
			.setName(options.name)
			.setDescription(options.description)
			.setRequired(!!options.required)
	);
