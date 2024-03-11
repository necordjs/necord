import { Listener } from './listener.decorator';
import { NecordEvents } from '../listener.interface';

/**
 * Decorator that marks a method as a listener for discord.js client.
 * @param event
 * @returns The decorated method.
 * @url https://necord.org/listeners
 */
export const Once = <K extends keyof E, E = NecordEvents>(event: K) =>
	Listener({ type: 'once', event });
