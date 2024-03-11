import { ContextMenuDiscovery, ContextMenuMeta } from '../context-menu.discovery';
import { Reflector } from '@nestjs/core';

/**
 * Decorator that marks a method as a context menu.
 * @param options The context menu options.
 * @returns The decorated method.
 * @see ContextMenuDiscovery
 * @see ContextMenuMeta
 * @see MessageCommand
 * @see UserCommand
 * @url https://necord.org/interactions/context-menus
 */
export const ContextMenu = Reflector.createDecorator<ContextMenuMeta, ContextMenuDiscovery>({
	transform: options => new ContextMenuDiscovery(options)
});
