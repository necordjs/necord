import { SetMetadata } from '@nestjs/common';
import { LISTENERS_METADATA } from '../necord.constants';
import { ListenerMetadata, NecordEvents } from '../interfaces';

export const On = createNecordListenerDecorator('on');

export const Once = createNecordListenerDecorator('once');

function createNecordListenerDecorator(type: ListenerMetadata['type']) {
	return <T extends keyof NecordEvents = keyof NecordEvents>(event: T): MethodDecorator =>
		SetMetadata<string, ListenerMetadata>(LISTENERS_METADATA, {
			type,
			event
		});
}
