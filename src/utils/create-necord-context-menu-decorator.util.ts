import { ApplicationCommandType, Interaction } from 'discord.js';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { createNecordListener } from './create-necord-listener-decorator.util';
import { APPLICATION_COMMAND_METADATA } from '../necord.constants';

export function createNecordContextMenu(
	type: Exclude<ApplicationCommandType, 'CHAT_INPUT'>,
	name: string,
	defaultPermission = true
) {
	return applyDecorators(
		createNecordListener({
			event: 'interactionCreate',
			once: false,
			filter: (i: Interaction) => i.isContextMenu() && i.commandName === name && i.targetType === type
		}),
		SetMetadata(APPLICATION_COMMAND_METADATA, { type, name, defaultPermission })
	);
}
