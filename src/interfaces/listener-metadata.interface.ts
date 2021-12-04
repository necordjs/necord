import { ClientEvents } from 'discord.js';

export interface ListenerMetadata<U extends keyof ClientEvents = keyof ClientEvents> {
	event: U;
	type: 'once' | 'on';
}
