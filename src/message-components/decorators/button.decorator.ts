import { ComponentType } from 'discord.js';
import { MessageComponent } from './message-component.decorator';

export const Button = (customId: string) =>
	MessageComponent({ customId, type: ComponentType.Button });
