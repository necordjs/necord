import { DiscoveryService, Reflector } from '@nestjs/core';
import { ClientEvents } from 'discord.js';

export const CustomListener = DiscoveryService.createDecorator<keyof ClientEvents>();

export const CustomListenerHandler = Reflector.createDecorator({
	transform: () => true
});
