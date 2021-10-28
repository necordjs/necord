import { PrimitiveOptionMetadata } from '../../interfaces';
import { createNecordOption } from '../../utils';
import { SlashCommandStringOption } from '@discordjs/builders';

export const StringOption = (options: PrimitiveOptionMetadata) =>
	createNecordOption(
		resolver => resolver.getString(options.name, !!options.required),
		new SlashCommandStringOption()
			.setName(options.name)
			.setDescription(options.description)
			.setRequired(!!options.required)
			.addChoices(options.choices ?? [])
	);
