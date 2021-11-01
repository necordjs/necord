import { createNecordListener } from '../utils';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApplicationCommandType, Interaction } from 'discord.js';
import { APPLICATION_COMMAND_METADATA } from '../necord.constants';

const ContextMenu = (type: Exclude<ApplicationCommandType, 'CHAT_INPUT'>, name: string, defaultPermission = true) =>
	applyDecorators(
		createNecordListener({
			event: 'interactionCreate',
			once: false,
			filter: (i: Interaction) => i.isContextMenu() && i.commandName === name && i.targetType === type
		}),
		SetMetadata(APPLICATION_COMMAND_METADATA, { type, name, defaultPermission })
	);

export const MessageCommand = (name: string, defaultPermission = true) =>
	ContextMenu('MESSAGE', name, defaultPermission);

export const UserCommand = (name: string, defaultPermission = true) => ContextMenu('USER', name, defaultPermission);
