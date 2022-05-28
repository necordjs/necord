import { createParamDecorator, SetMetadata } from '@nestjs/common';
import { MODAL_METADATA } from '../necord.constants';
import { NecordExecutionContext } from '../context';
import { ModalMeta } from '../discovery';

export const Modal = (customId: string): MethodDecorator =>
	SetMetadata<string, ModalMeta>(MODAL_METADATA, { customId });

export const Fields = createParamDecorator((customId, context) => {
	const necordContext = NecordExecutionContext.create(context);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (!interaction.isModalSubmit()) {
		return null;
	}

	return customId ? interaction.fields.getTextInputValue(customId) : interaction.fields;
});
