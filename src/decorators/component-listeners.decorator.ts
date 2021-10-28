import { createNecordListener } from '../utils';
import { ButtonInteraction, SelectMenuInteraction } from 'discord.js';

export const Button = (customId: string) =>
	createNecordListener({
		event: 'interactionCreate',
		once: false,
		filter: (i: ButtonInteraction) => i.isButton() && i.customId === customId
	});

export const SelectMenu = (customId: string) =>
	createNecordListener({
		event: 'interactionCreate',
		once: false,
		filter: (i: SelectMenuInteraction) => i.isSelectMenu() && i.customId === customId
	});
