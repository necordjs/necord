import { createNecordListenerDecorator } from '../utils';

export const On = createNecordListenerDecorator(false);

export const Once = createNecordListenerDecorator(true);
