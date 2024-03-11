import { ApplicationCommandType } from 'discord.js';
import { ContextMenuMeta } from '../context-menu.discovery';
import { ContextMenu } from './context-menu.decorator';

/**
 * Decorator that marks a method as a user context menu.
 * @param options The context menu options.
 * @returns The decorated method.
 * @see ContextMenu
 * @see ContextMenuMeta
 * @see TargetUser
 * @see TargetMessage
 * @url https://necord.org/interactions/context-menus#user-commands
 * @example
 * ```ts
 * @UserCommand({ name: 'ping' })
 * public async ping(@TargetUser() user: User) {
 *     user.send('Pong!');
 * }
 * ```
 */
export const UserCommand = (options: Omit<ContextMenuMeta, 'type'>) =>
	ContextMenu({ type: ApplicationCommandType.User, ...options });
