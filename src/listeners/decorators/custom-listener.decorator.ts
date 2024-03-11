import { DiscoveryService, Reflector } from '@nestjs/core';
import { ClientEvents } from 'discord.js';

/**
 * Decorator that marks a class as a custom listener.
 * @param event The event name.
 * @returns The decorated class.
 * @url https://necord.org/listeners
 */
export const CustomListener = DiscoveryService.createDecorator<keyof ClientEvents>();

/**
 * Decorator that marks a method as a custom listener handler.
 * @returns The decorated method.
 */
export const CustomListenerHandler = Reflector.createDecorator({
	transform: () => true
});
