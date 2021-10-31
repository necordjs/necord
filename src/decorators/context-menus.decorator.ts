import { createNecordListener } from '../utils';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApplicationCommandType, Interaction } from 'discord.js';
import { ContextMenuCommandBuilder, ContextMenuCommandType } from '@discordjs/builders';
import { APPLICATION_COMMAND_METADATA } from '../necord.constants';

const ContextMenu = (type: Exclude<ApplicationCommandType, 'CHAT_INPUT'>, name: string, defaultPermission = true) =>
	applyDecorators(
		createNecordListener({
			event: 'interactionCreate',
			once: false,
			filter: (i: Interaction) => i.isContextMenu() && i.commandName === name && i.targetType === type
		}),
		SetMetadata(
			APPLICATION_COMMAND_METADATA,
			new ContextMenuCommandBuilder()
				.setName(name)
				.setType(type as any)
				.setDefaultPermission(defaultPermission)
		)
	);

export const MessageCommand = (name: string, defaultPermission = true) =>
	ContextMenu('MESSAGE', name, defaultPermission);

export const UserCommand = (name: string, defaultPermission = true) => ContextMenu('USER', name, defaultPermission);
