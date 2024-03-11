import { MessageComponentDiscovery, MessageComponentMeta } from '../message-component.discovery';
import { Reflector } from '@nestjs/core';

/**
 * Decorator that marks a method as a message component for discord.js client.
 * @param options The message component options.
 * @returns The decorated method.
 * @url https://necord.org/interactions/message-components
 */
export const MessageComponent = Reflector.createDecorator<
	MessageComponentMeta,
	MessageComponentDiscovery
>({
	transform: options => new MessageComponentDiscovery(options)
});
