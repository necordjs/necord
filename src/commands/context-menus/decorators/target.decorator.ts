import { createParamDecorator } from '@nestjs/common';
import { NecordExecutionContext } from '../../../context';

export const Target = createParamDecorator((_, context) => {
	const necordContext = NecordExecutionContext.create(context);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (!interaction.isContextMenuCommand()) return null;

	return interaction.isMessageContextMenuCommand()
		? interaction.options.getMessage('message')
		: interaction.options.getUser('user');
});
