import { SetMetadata } from '@nestjs/common';
import { ModalMetadata } from '../interfaces';
import { MODALS_METADATA } from '../necord.constants';

export const Modal = (customId: string) =>
	SetMetadata<string, ModalMetadata>(MODALS_METADATA, { customId });
