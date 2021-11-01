import { createNecordListener } from '../utils';
import { ButtonInteraction } from 'discord.js';

export const Button = (customId: string) =>
	createNecordListener({
		event: 'interactionCreate',
		once: false,
		filter: (i: ButtonInteraction) => i.isButton() && i.customId === customId
	});
