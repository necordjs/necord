import {
	ButtonInteraction,
	ClientEvents,
	CommandInteraction,
	MessageContextMenuInteraction,
	SelectMenuInteraction
} from 'discord.js';

export type SlashCommandContext = [CommandInteraction];

export type MessageCommandContext = [MessageContextMenuInteraction];

export type UserCommandContext = [MessageContextMenuInteraction];

export type ButtonContext = [ButtonInteraction];

export type SelectMenuContext = [SelectMenuInteraction];

export type ContextOf<K extends keyof E, E = ClientEvents> = E[K];
