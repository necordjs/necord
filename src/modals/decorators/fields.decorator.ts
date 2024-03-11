import { createParamDecorator } from '@nestjs/common';
import { NecordExecutionContext } from '../../context';

/**
 * Represents a fields param decorator.
 * @url https://necord.org/interactions/modals
 * @param customId The custom id.
 * @returns The fields param decorator.
 */
export const Fields = createParamDecorator((customId, context) => {
	const necordContext = NecordExecutionContext.create(context);
	const [interaction] = necordContext.getContext<'interactionCreate'>();
	const discovery = necordContext.getDiscovery();

	if (!interaction.isModalSubmit() || !discovery.isModal()) {
		return null;
	}

	return customId ? interaction.fields.getTextInputValue(customId) : interaction.fields;
});
