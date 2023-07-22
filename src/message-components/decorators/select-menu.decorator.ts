import { ComponentType } from 'discord.js';
import { MessageComponent } from './message-component.decorator';

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
