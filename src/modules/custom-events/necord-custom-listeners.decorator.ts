import { CustomEvents } from './necord-custom-events.interface';
import { createNecordListenerDecorator } from '../../listeners';

export const CustomOn = createNecordListenerDecorator<keyof CustomEvents, CustomEvents>('on');

export const CustomOnce = createNecordListenerDecorator<keyof CustomEvents, CustomEvents>('once');
