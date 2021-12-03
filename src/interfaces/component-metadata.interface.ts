import { MessageComponentTypes } from 'discord.js/typings/enums';
import { MethodMetadata } from './method-metadata.interface';

export interface ComponentMetadata extends MethodMetadata {
	type: MessageComponentTypes;
	customId: string;
}
