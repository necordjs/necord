import { ContextMenuDiscovery, ContextMenuMeta } from '../context-menu.discovery';
import { SetMetadata } from '@nestjs/common';
import { CONTEXT_MENU_METADATA } from '../../../necord.constants';

export const ContextMenu = (options: ContextMenuMeta) =>
	SetMetadata<string, ContextMenuDiscovery>(
		CONTEXT_MENU_METADATA,
		new ContextMenuDiscovery(options)
	);
