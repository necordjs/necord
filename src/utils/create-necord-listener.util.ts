import { ListenerMetadata } from '../interfaces';
import { SetMetadata } from '@nestjs/common';
import { LISTENERS_METADATA } from '../necord.constants';
import { ClientEvents } from 'discord.js';

export function createNecordListenerDecorator<K extends keyof E, E = ClientEvents>(
	type: ListenerMetadata['type']
) {
	return (event: K): MethodDecorator =>
		SetMetadata<string, ListenerMetadata>(LISTENERS_METADATA, {
			type,
			event: event.toString()
		});
}
