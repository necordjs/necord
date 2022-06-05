import { SetMetadata } from '@nestjs/common';
import { ModalMeta } from '../modal.discovery';
import { MODAL_METADATA } from '../../necord.constants';

export const Modal = (customId: string): MethodDecorator =>
	SetMetadata<string, ModalMeta>(MODAL_METADATA, { customId });
