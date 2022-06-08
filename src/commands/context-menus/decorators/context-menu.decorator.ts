import { ContextMenuMeta } from '../context-menu.discovery';
import { SetMetadata } from '@nestjs/common';
import { CONTEXT_MENU_METADATA } from '../../../necord.constants';

export const ContextMenu = (options: ContextMenuMeta) =>
	SetMetadata<string, ContextMenuMeta>(CONTEXT_MENU_METADATA, options);
