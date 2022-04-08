import { SetMetadata } from '@nestjs/common';
import { ComponentMeta } from './message-component.discovery';
import { MESSAGE_COMPONENT_METADATA } from './message-components.constants';

const createNecordComponentDecorator =
	(type: ComponentMeta['type']) =>
	(customId: string): MethodDecorator =>
		SetMetadata<string, ComponentMeta>(MESSAGE_COMPONENT_METADATA, { type, customId });

export const Button = createNecordComponentDecorator('BUTTON');

export const SelectMenu = createNecordComponentDecorator('SELECT_MENU');
