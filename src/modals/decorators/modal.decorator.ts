import { Reflector } from '@nestjs/core';

import { ModalDiscovery } from '../modal.discovery';

/**
 * Decorator that marks a method as a modal for discord.js client.
 * @param customId The custom id of the modal.
 * @url https://necord.org/interactions/modals
 */
export const Modal = Reflector.createDecorator<string, ModalDiscovery>({
	transform: customId => new ModalDiscovery({ customId })
});
