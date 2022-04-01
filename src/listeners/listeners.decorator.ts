import { createNecordListenerDecorator } from './listeners.util';
import { NecordEvents } from './listener-events.interface';

export const On = createNecordListenerDecorator<keyof NecordEvents, NecordEvents>('on');

export const Once = createNecordListenerDecorator<keyof NecordEvents, NecordEvents>('once');
