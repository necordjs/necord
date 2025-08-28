import { Listener } from './listener.decorator';
import { NecordEvents } from '../listener.interface';

/**
 * Decorator that marks a method as a listener for the discord.js client.
 * @param event The event name.
 * @returns The decorated method.
 * @url https://necord.org/listeners
 */
export function On<E = NecordEvents>(event: keyof NoInfer<E>): ReturnType<typeof Listener>;
/**
 * @deprecated Use `On<CustomEvents>()` instead - This will be removed in future versions.
 * Or use `createCustomOnDecorator<CustomEvents>()` to create a custom `On` decorator.
 */
export function On<K extends keyof E, E = NecordEvents>(event: K): ReturnType<typeof Listener>;
export function On(event: keyof NecordEvents) {
	return Listener({ type: 'on', event });
}

/**
 * Helper to create a strongly typed `On` decorator for custom events.
 * This is useful when you have custom events that are not part of the default `NecordEvents`.
 * @example
 * ```typescript
 * interface CustomEvents {
 *  myCustomEvent: [string, number];
 *  anotherEvent: [boolean];
 * }
 *
 * const OnCustom = createCustomOnDecorator<CustomEvents>();
 *
 * class MyListener {
 *  @OnCustom('myCustomEvent')
 *  handleMyCustomEvent(@Context() [name, age]: [string, number]) {
 *   console.log(`Name: ${name}, Age: ${age}`);
 *  }
 * }
 *```
 * @returns A strongly typed `On` decorator for custom events.
 */
export function createCustomOnDecorator<Events>() {
	return <K extends keyof Events>(event: K) => On<Events>(event);
}
