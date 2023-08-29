import { ModalDiscovery } from '../modal.discovery';
import { Reflector } from '@nestjs/core';

export const Modal = Reflector.createDecorator<string, ModalDiscovery>({
	transform: customId => new ModalDiscovery({ customId })
});
