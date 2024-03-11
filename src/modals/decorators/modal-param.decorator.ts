import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NecordExecutionContext } from '../../context';

/**
 * Represents a modal param decorator.
 * @url https://necord.org/interactions/modals
 * @returns The modal param decorator.
 * @url https://necord.org/interactions/modals#dynamic-modal
 */
export const ModalParam = createParamDecorator((data, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();
	const discovery = necordContext.getDiscovery();

	if (!discovery.isModal() || !interaction.isModalSubmit()) return null;

	const match = discovery.matcher(interaction.customId);

	if (!match) return null;

	return data ? match.params[data] : match.params;
});
