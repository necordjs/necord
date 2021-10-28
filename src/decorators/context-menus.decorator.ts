import { createNecordListener } from '../utils';
import { ApplicationCommandType } from 'discord-api-types';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Interaction } from 'discord.js';
import { ContextMenuCommandBuilder, ContextMenuCommandType } from '@discordjs/builders';
import { APPLICATION_COMMAND_METADATA } from '../necord.constants';

const ContextMenu = (type: ContextMenuCommandType, name: string, defaultPermission = true) =>
	applyDecorators(
		createNecordListener({
			event: 'interactionCreate',
			once: false,
			filter: (i: Interaction) =>
				i.isContextMenu() &&
				i.commandName === name &&
				i.targetType === (type === ApplicationCommandType.User ? 'USER' : 'MESSAGE')
		}),
		SetMetadata(
			APPLICATION_COMMAND_METADATA,
			new ContextMenuCommandBuilder().setName(name).setType(type).setDefaultPermission(defaultPermission)
		)
	);

export const MessageCommand = (name: string, defaultPermission = true) =>
	ContextMenu(ApplicationCommandType.Message, name, defaultPermission);

export const UserCommand = (name: string, defaultPermission = true) =>
	ContextMenu(ApplicationCommandType.User, name, defaultPermission);
