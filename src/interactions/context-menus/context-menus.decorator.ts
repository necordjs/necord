import { ContextMenuMeta } from './context-menu.discovery';
import { SetMetadata } from '@nestjs/common';
import { CONTEXT_MENU_METADATA } from '../../necord.constants';

export const UserCommand = createNecordContextMenu('USER');

export const MessageCommand = createNecordContextMenu('MESSAGE');

function createNecordContextMenu(type: ContextMenuMeta['type']) {
	return (name: string): MethodDecorator =>
		SetMetadata(CONTEXT_MENU_METADATA, {
			type,
			name
		});
}
