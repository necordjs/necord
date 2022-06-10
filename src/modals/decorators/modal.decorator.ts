import { SetMetadata } from '@nestjs/common';
import { ModalDiscovery } from '../modal.discovery';
import { MODAL_METADATA } from '../../necord.constants';

export const Modal = (customId: string): MethodDecorator =>
	SetMetadata<string, ModalDiscovery>(MODAL_METADATA, new ModalDiscovery({ customId }));
