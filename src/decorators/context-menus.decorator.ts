import { SetMetadata } from '@nestjs/common';
import { CONTEXT_MENU_METADATA } from '../necord.constants';
import {
	RESTPostAPIContextMenuApplicationCommandsJSONBody,
	ApplicationCommandType
} from 'discord-api-types/v10';

export const UserCommand = createNecordContextMenu(ApplicationCommandType.User);

export const MessageCommand = createNecordContextMenu(ApplicationCommandType.Message);

function createNecordContextMenu(type: RESTPostAPIContextMenuApplicationCommandsJSONBody['type']) {
	return (
		data: Omit<
			RESTPostAPIContextMenuApplicationCommandsJSONBody,
			'type' | 'options' | 'description_localizations'
		>
	): MethodDecorator =>
		SetMetadata<string, RESTPostAPIContextMenuApplicationCommandsJSONBody>(
			CONTEXT_MENU_METADATA,
			{
				type,
				...data
			}
		);
}
