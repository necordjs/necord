import { ClientEvents } from 'discord.js';

export interface ListenerMetadata {
	event: keyof ClientEvents;
	once?: boolean;
	filter?: (...args) => boolean;
}
