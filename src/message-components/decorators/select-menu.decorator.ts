import { ComponentType } from 'discord.js';
import { MessageComponent } from './message-component.decorator';

/**
 *  @deprecated since 5.4 - This is the old name for StringSelect.
 *  Will be deleted in v6
 */
export const SelectMenu = (customId: string) =>
	MessageComponent({ customId, type: ComponentType.SelectMenu });

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
