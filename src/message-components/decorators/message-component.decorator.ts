import { MessageComponentMeta } from '../message-component.discovery';
import { SetMetadata } from '@nestjs/common';
import { MESSAGE_COMPONENT_METADATA } from '../../necord.constants';

export const MessageComponent = (options: MessageComponentMeta) =>
	SetMetadata<string, MessageComponentMeta>(MESSAGE_COMPONENT_METADATA, options);
