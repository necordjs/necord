import { createNecordListener } from '../utils';
import { SelectMenuInteraction } from 'discord.js';

export const SelectMenu = (customId: string) =>
	createNecordListener({
		event: 'interactionCreate',
		once: false,
		filter: (i: SelectMenuInteraction) => i.isSelectMenu() && i.customId === customId
	});
