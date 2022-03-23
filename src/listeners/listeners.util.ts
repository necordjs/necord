import { SetMetadata } from '@nestjs/common';
import { ClientEvents } from 'discord.js';
import { ListenerMeta } from './listener.discovery';
import { LISTENERS_METADATA } from './listeners.constants';

export function createNecordListenerDecorator<K extends keyof E, E = ClientEvents>(
	type: ListenerMeta['type']
) {
	return (event: K): MethodDecorator =>
		SetMetadata<string, ListenerMeta>(LISTENERS_METADATA, {
			type,
			event: event.toString()
		});
}
