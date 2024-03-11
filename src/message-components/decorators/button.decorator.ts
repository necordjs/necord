import { ComponentType } from 'discord.js';
import { MessageComponent } from './message-component.decorator';

/**
 * Decorator that marks a method as a button for discord.js client.
 * @param customId
 * @url https://necord.org/interactions/message-components#button
 */
export const Button = (customId: string) =>
	MessageComponent({ customId, type: ComponentType.Button });
