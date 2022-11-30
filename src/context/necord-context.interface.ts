import {
	AutocompleteInteraction,
	ButtonInteraction,
	ChannelSelectMenuInteraction,
	ChatInputCommandInteraction,
	MentionableSelectMenuInteraction,
	Message,
	MessageContextMenuCommandInteraction,
	ModalSubmitInteraction,
	RoleSelectMenuInteraction,
	SelectMenuInteraction,
	StringSelectMenuInteraction,
	UserContextMenuCommandInteraction,
	UserSelectMenuInteraction
} from 'discord.js';
import { NecordEvents } from '../listeners/listener.interface';

export type AutocompleteContext = [AutocompleteInteraction];

export type SlashCommandContext = [ChatInputCommandInteraction];

export type TextCommandContext = [Message];

export type MessageCommandContext = [MessageContextMenuCommandInteraction];

export type UserCommandContext = [UserContextMenuCommandInteraction];

export type ModalContext = [ModalSubmitInteraction];

export type ButtonContext = [ButtonInteraction];

// TODO: Remove in v6
/**
 *  @deprecated since v5.4 - old name for `StringSelectContext`. Will be removed in v6. Discord now uses new select menus
 *  @see {@link https://discord.js.org/#/docs/discord.js/main/class/SelectMenuInteraction DiscordJS docs}
 *  @see {@link https://discord.com/developers/docs/interactions/message-components#select-menus Discord API docs}
 *  @see {@link https://discord.com/developers/docs/interactions/message-components#component-object-component-types ComponentType}
 */
export type SelectMenuContext = [SelectMenuInteraction];

export type StringSelectContext = [StringSelectMenuInteraction];

export type ChannelSelectContext = [ChannelSelectMenuInteraction];

export type RoleSelectContext = [RoleSelectMenuInteraction];

export type UserSelectContext = [UserSelectMenuInteraction];

export type MentionableSelectContext = [MentionableSelectMenuInteraction];

export type ContextOf<K extends keyof E, E = NecordEvents> = E[K];
