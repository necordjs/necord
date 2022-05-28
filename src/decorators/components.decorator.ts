import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { ComponentMeta } from '../discovery';
import { MESSAGE_COMPONENT_METADATA } from '../necord.constants';
import { NecordExecutionContext } from '../context';
import { ComponentType } from 'discord.js';

export const Button = createNecordComponentDecorator(ComponentType.Button);

export const SelectMenu = createNecordComponentDecorator(ComponentType.SelectMenu);

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

function createNecordComponentDecorator(type: ComponentMeta['type']) {
	return (customId: string): MethodDecorator =>
		SetMetadata<string, ComponentMeta>(MESSAGE_COMPONENT_METADATA, { type, customId });
}
