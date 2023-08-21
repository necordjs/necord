import { MessageComponentDiscovery, MessageComponentMeta } from '../message-component.discovery';
import { Reflector } from '@nestjs/core';

export const MessageComponent = Reflector.createDecorator<MessageComponentMeta>({
	transform: options => new MessageComponentDiscovery(options)
});
