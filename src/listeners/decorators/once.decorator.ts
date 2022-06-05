import { Listener } from './listener.decorator';
import { NecordEvents } from '../listener.interface';

export const Once = <K extends keyof E, E = NecordEvents>(event: K) =>
	Listener({ type: 'once', event });
