import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NecordExecutionContext } from '../../context';
import { InteractionType } from 'discord-api-types/v10';

export const ComponentParam = createParamDecorator((data, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();
	const discovery = necordContext.getDiscovery();

	if (!discovery.isMessageComponent() || interaction.type !== InteractionType.MessageComponent)
		return null;

	const match = discovery.matcher([interaction.componentType, interaction.customId].join('_'));

	if (!match) return null;

	return data ? match.params[data] : match.params;
});
