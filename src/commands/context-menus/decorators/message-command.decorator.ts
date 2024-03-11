import { ContextMenuMeta } from '../context-menu.discovery';
import { ApplicationCommandType } from 'discord.js';
import { ContextMenu } from './context-menu.decorator';

/**
 * Decorator that marks a method as a message context menu.
 * @param options The context menu options.
 * @returns The decorated method.
 * @see ContextMenu
 * @see ContextMenuMeta
 * @see TargetMessage
 * @url https://necord.org/interactions/context-menus#message-commands
 * @example
 * ```ts
 * @MessageCommand({ name: 'quote', type: 'MESSAGE' })
 * public async quote(@TargetMessage() message: Message) {
 *     message.reply('Quoting...');
 * }
 * ```
 */
export const MessageCommand = (options: Omit<ContextMenuMeta, 'type'>) =>
	ContextMenu({ type: ApplicationCommandType.Message, ...options });
