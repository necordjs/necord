import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { ComponentMeta } from '../discovery';
import { MESSAGE_COMPONENT_METADATA } from '../necord.constants';
import { NecordExecutionContext } from '../context';

const createNecordComponentDecorator =
	(type: ComponentMeta['type']) =>
	(customId: string): MethodDecorator =>
		SetMetadata<string, ComponentMeta>(MESSAGE_COMPONENT_METADATA, { type, customId });

export const Button = createNecordComponentDecorator('BUTTON');

export const SelectMenu = createNecordComponentDecorator('SELECT_MENU');

export const Component = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	return interaction.isMessageComponent() ? interaction.component : null;
});

export const Values = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	return interaction.isSelectMenu() ? interaction.values : [];
});
