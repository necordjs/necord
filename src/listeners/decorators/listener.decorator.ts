import { ListenerDiscovery, ListenerMeta } from '../listener.discovery';
import { Reflector } from '@nestjs/core';

/**
 * Decorator that marks a method as a listener for discord.js client.
 * @param options The listener options.
 * @returns The decorated method.
 * @url https://necord.org/listeners
 */
export const Listener = Reflector.createDecorator<ListenerMeta, ListenerDiscovery>({
	transform: options => new ListenerDiscovery(options)
});
