import { createParamDecorator } from '@nestjs/common';
import { NecordExecutionContext } from '../../context';

/**
 * Represents a components param decorator.
 * @url https://necord.org/interactions/modals
 * @param customId The custom id.
 * @returns The components param decorator.
 */
export const ModalComponents = createParamDecorator((customId, context) => {
	const necordContext = NecordExecutionContext.create(context);
	const [interaction] = necordContext.getContext<'interactionCreate'>();
	const discovery = necordContext.getDiscovery();

	if (!interaction.isModalSubmit() || !discovery.isModal()) {
		return null;
	}

	return customId ? interaction.components.getComponent(customId) : interaction.components;
});
