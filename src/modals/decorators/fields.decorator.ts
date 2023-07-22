import { createParamDecorator } from '@nestjs/common';
import { NecordExecutionContext } from '../../context';

export const Fields = createParamDecorator((customId, context) => {
	const necordContext = NecordExecutionContext.create(context);
	const [interaction] = necordContext.getContext<'interactionCreate'>();
	const discovery = necordContext.getDiscovery();

	if (!interaction.isModalSubmit() || !discovery.isModal()) {
		return null;
	}

	return customId ? interaction.fields.getTextInputValue(customId) : interaction.fields;
});
