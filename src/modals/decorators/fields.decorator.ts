import { createParamDecorator } from '@nestjs/common';
import { NecordExecutionContext } from '../../context';
import { InteractionType } from 'discord.js';

export const Fields = createParamDecorator((customId, context) => {
	const necordContext = NecordExecutionContext.create(context);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (interaction.type !== InteractionType.ModalSubmit) {
		return null;
	}

	return customId ? interaction.fields.getTextInputValue(customId) : interaction.fields;
});
