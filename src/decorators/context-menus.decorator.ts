import { ContextMenuMeta } from '../discovery';
import { SetMetadata } from '@nestjs/common';
import { CONTEXT_MENU_METADATA } from '../necord.constants';
import { ApplicationCommandType } from 'discord.js';

export const UserCommand = createNecordContextMenu(ApplicationCommandType.User);

export const MessageCommand = createNecordContextMenu(ApplicationCommandType.Message);

function createNecordContextMenu(type: ContextMenuMeta['type']) {
	return (name: string): MethodDecorator =>
		SetMetadata(CONTEXT_MENU_METADATA, {
			type,
			name
		});
}
