import { MessageComponentTypes } from 'discord.js/typings/enums';
import { SetMetadata } from '@nestjs/common';
import { ComponentMetadata } from '../interfaces';
import { MESSAGE_COMPONENT_METADATA } from '../necord.constants';

export function createNecordComponentDecorator(type: MessageComponentTypes): (customId: string) => MethodDecorator {
	return customId => SetMetadata<string, ComponentMetadata>(MESSAGE_COMPONENT_METADATA, { type, customId });
}
