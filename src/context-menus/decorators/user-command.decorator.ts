import { ContextMenuMeta } from '../context-menu.discovery';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { ContextMenu } from './context-menu.decorator';

export const UserCommand = (options: Omit<ContextMenuMeta, 'type'>) =>
	ContextMenu({ type: ApplicationCommandType.User, ...options });
