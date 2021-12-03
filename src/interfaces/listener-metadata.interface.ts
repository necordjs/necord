import { ClientEvents } from 'discord.js';
import { MethodMetadata } from './method-metadata.interface';

export interface ListenerMetadata<U extends keyof ClientEvents = keyof ClientEvents> extends MethodMetadata {
	event: U;
	once: boolean;
}
