import { ComponentType } from 'discord.js';
import { MessageComponent } from './message-component.decorator';

export const SelectMenu = (customId: string) =>
	MessageComponent({ customId, type: ComponentType.SelectMenu });
