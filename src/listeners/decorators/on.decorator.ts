import { Listener } from './listener.decorator';
import { NecordEvents } from '../listener.interface';

export const On = <K extends keyof E, E = NecordEvents>(event: K, botNames?: string[]) =>
	Listener({ type: 'on', event, botNames });
