import { ContextMenuDiscovery, ContextMenuMeta } from '../context-menu.discovery';
import { Reflector } from '@nestjs/core';

export const ContextMenu = Reflector.createDecorator<ContextMenuMeta>({
	transform: options => new ContextMenuDiscovery(options)
});
