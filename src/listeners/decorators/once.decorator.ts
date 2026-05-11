import { NecordEvents } from '../listener.interface';
import { Listener } from './listener.decorator';

/**
 * Decorator that marks a method as a listener for discord.js client.
 * @param event
 * @returns The decorated method.
 * @url https://necord.org/listeners
 */
export function Once<E = NecordEvents>(event: keyof NoInfer<E>): ReturnType<typeof Listener> {
	return Listener({ type: 'once', event });
}

/**
 * Helper to create a strongly typed `Once` decorator for custom events.
 * This is useful when you have custom events that are not part of the default `NecordEvents`.
 * @example
 * ```typescript
 * interface CustomEvents {
 *  myCustomEvent: [string, number];
 *  anotherEvent: [boolean];
 * }
 *
 * const OnceCustom = createCustomOnceDecorator<CustomEvents>();
 *
 * class MyListener {
 *  @OnceCustom('myCustomEvent')
 *  handleMyCustomEvent(@Context() [name, age]: [string, number]) {
 *   console.log(`Name: ${name}, Age: ${age}`);
 *  }
 * }
 *```
 * @returns A strongly typed `Once` decorator for custom events.
 */
export function createCustomOnceDecorator<Events>() {
	return <K extends keyof Events>(event: K) => Once<Events>(event);
}
