import { NecordEvents } from '../../interfaces';
import { Listener } from './listener.decorator';

export const On = <K extends keyof E, E = NecordEvents>(event: K) =>
	Listener({ type: 'on', event });
