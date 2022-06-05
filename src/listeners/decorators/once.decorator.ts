import { NecordEvents } from '../../interfaces';
import { Listener } from './listener.decorator';

export const Once = <K extends keyof E, E = NecordEvents>(event: K) =>
	Listener({ type: 'once', event });
