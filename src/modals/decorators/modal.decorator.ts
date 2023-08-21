import { ModalDiscovery } from '../modal.discovery';
import { Reflector } from '@nestjs/core';

export const Modal = Reflector.createDecorator<string>({
	transform: customId => new ModalDiscovery({ customId })
});
