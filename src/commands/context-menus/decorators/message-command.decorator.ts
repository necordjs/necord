import { ContextMenuMeta } from '../context-menu.discovery';
import { ApplicationCommandType } from 'discord.js';
import { ContextMenu } from './context-menu.decorator';

export const MessageCommand = (options: Omit<ContextMenuMeta, 'type'>) =>
	ContextMenu({ type: ApplicationCommandType.Message, ...options });
