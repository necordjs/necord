import { CONTEXT_MENU_METADATA } from '../necord.constants';
import { SetMetadata } from '@nestjs/common';
import { ContextMenuMetadata } from '../interfaces';

const createNecordContextMenu =
	(type: ContextMenuMetadata['type']) =>
	(name: string): MethodDecorator =>
		SetMetadata<string, ContextMenuMetadata>(CONTEXT_MENU_METADATA, {
			type,
			name
		});

export const UserCommand = createNecordContextMenu('USER');

export const MessageCommand = createNecordContextMenu('MESSAGE');
