import { PrimitiveOptionMetadata } from '../../interfaces';
import { createNecordOption } from '../../utils';
import { SlashCommandIntegerOption, SlashCommandNumberOption } from '@discordjs/builders';

export const IntegerOption = (options: PrimitiveOptionMetadata<number>) =>
	createNecordOption(
		resolver => resolver.getInteger(options.name, !!options.required),
		new SlashCommandIntegerOption()
			.setName(options.name)
			.setDescription(options.description)
			.setRequired(!!options.required)
			.addChoices(options.choices ?? [])
	);
