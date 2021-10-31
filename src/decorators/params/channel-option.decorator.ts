import { ChannelOptionMetadata } from '../../interfaces';
import { createNecordOption } from '../../utils';
import { SlashCommandChannelOption } from '@discordjs/builders';

export const ChannelOption = (options: ChannelOptionMetadata) =>
	createNecordOption(
		resolver => resolver.getChannel(options.name, !!options.required),
		new SlashCommandChannelOption()
			.setName(options.name)
			.setDescription(options.description)
			.setRequired(!!options.required)
			.addChannelTypes(options.types as any)
	);
