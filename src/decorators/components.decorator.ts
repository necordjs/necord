import { SetMetadata } from '@nestjs/common';
import { ComponentMetadata } from '../interfaces';
import { MESSAGE_COMPONENT_METADATA } from '../necord.constants';

const createNecordComponentDecorator =
	(type: ComponentMetadata['type']) =>
	(customId: string): MethodDecorator =>
		SetMetadata<string, ComponentMetadata>(MESSAGE_COMPONENT_METADATA, { type, customId });

export const Button = createNecordComponentDecorator('BUTTON');

export const SelectMenu = createNecordComponentDecorator('SELECT_MENU');
