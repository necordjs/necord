import { ClientEvents } from 'discord.js';
import { NecordEvents } from '../updates';

export interface ListenerMetadata<U extends keyof NecordEvents = keyof NecordEvents> {
	event: U;
	type: 'once' | 'on';
}
