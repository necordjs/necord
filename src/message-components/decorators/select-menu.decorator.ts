import { ComponentType } from 'discord.js';
import { MessageComponent } from './message-component.decorator';

/**
 *  @deprecated since 5.4 - This is the old name for StringSelect. Will be deleted in v6. Discord now uses new select menus
 *  @see {@link https://discord.js.org/#/docs/discord.js/main/class/SelectMenuInteraction DiscordJS docs}
 *  @see {@link https://discord.com/developers/docs/interactions/message-components#select-menus Discord API docs}
 *  @see {@link https://discord.com/developers/docs/interactions/message-components#component-object-component-types ComponentType}
 */
export const SelectMenu = (customId: string) =>
	MessageComponent({ customId, type: ComponentType.SelectMenu }); // TODO: Remove in v6

export const StringSelect = (customId: string) =>
	MessageComponent({ customId, type: ComponentType.StringSelect });

export const ChannelSelect = (customId: string) =>
	MessageComponent({ customId, type: ComponentType.ChannelSelect });

export const UserSelect = (customId: string) =>
	MessageComponent({ customId, type: ComponentType.UserSelect });

export const MentionableSelect = (customId: string) =>
	MessageComponent({ customId, type: ComponentType.MentionableSelect });

export const RoleSelect = (customId: string) =>
	MessageComponent({ customId, type: ComponentType.RoleSelect });
