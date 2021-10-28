import { PrimitiveOptionMetadata } from '../../interfaces';
import { createNecordOption } from '../../utils';
import { SlashCommandNumberOption, SlashCommandStringOption } from '@discordjs/builders';

export const NumberOption = (options: PrimitiveOptionMetadata<number>) =>
	createNecordOption(
		resolver => resolver.getNumber(options.name, !!options.required),
		new SlashCommandNumberOption()
			.setName(options.name)
			.setDescription(options.description)
			.setRequired(!!options.required)
			.addChoices(options.choices ?? [])
	);
