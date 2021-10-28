import { OptionMetadata } from '../../interfaces';
import { createNecordOption } from '../../utils';
import { SlashCommandRoleOption, SlashCommandUserOption } from '@discordjs/builders';

export const RoleOption = (options: OptionMetadata) =>
	createNecordOption(
		resolver => resolver.getRole(options.name, !!options.required),
		new SlashCommandRoleOption()
			.setName(options.name)
			.setDescription(options.description)
			.setRequired(!!options.required)
	);
