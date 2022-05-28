import { ListenerMeta } from '../discovery';
import { SetMetadata } from '@nestjs/common';
import { LISTENERS_METADATA } from '../necord.constants';
import { NecordEvents } from '../interfaces';

export const On = createNecordListenerDecorator('on');

export const Once = createNecordListenerDecorator('once');

function createNecordListenerDecorator<K extends keyof E, E = NecordEvents>(
	type: ListenerMeta['type']
) {
	return (event: K): MethodDecorator =>
		SetMetadata<string, ListenerMeta>(LISTENERS_METADATA, {
			type,
			event
		});
}
