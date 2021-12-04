import { MessageComponentTypes } from 'discord.js/typings/enums';

export interface ComponentMetadata {
	type: MessageComponentTypes;
	customId: string;
}
