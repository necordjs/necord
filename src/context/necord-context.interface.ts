import {
	AutocompleteInteraction,
	ButtonInteraction,
	CommandInteraction,
	Message,
	MessageContextMenuCommandInteraction,
	ModalSubmitInteraction,
	SelectMenuInteraction,
	UserContextMenuCommandInteraction
} from 'discord.js';
import { NecordEvents } from '../listeners/listener.interface';

export type AutocompleteContext = [AutocompleteInteraction];

export type SlashCommandContext = [CommandInteraction];

export type TextCommandContext = [Message];

export type MessageCommandContext = [MessageContextMenuCommandInteraction];

export type UserCommandContext = [UserContextMenuCommandInteraction];

export type ModalContext = [ModalSubmitInteraction];

export type ButtonContext = [ButtonInteraction];

export type SelectMenuContext = [SelectMenuInteraction];

export type ContextOf<K extends keyof E, E = NecordEvents> = E[K];
