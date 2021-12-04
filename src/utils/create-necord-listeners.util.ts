import { ClientEvents } from 'discord.js';
import { SetMetadata } from '@nestjs/common';
import { ListenerMetadata } from '../interfaces';
import { LISTENERS_METADATA } from '../necord.constants';

export function createNecordListenerDecorator(type: ListenerMetadata['type']) {
	return (event: keyof ClientEvents): MethodDecorator =>
		SetMetadata<string, ListenerMetadata>(LISTENERS_METADATA, {
			event,
			type
		});
}
