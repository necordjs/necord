import { createParamDecorator } from '@nestjs/common';
import { NecordExecutionContext } from '../../../context';

/**
 * @deprecated Use `@TargetMessage`, `@TargetUser` or `@TargetMember` instead
 */
export const Target = createParamDecorator((_, context) => {
	const necordContext = NecordExecutionContext.create(context);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (!interaction.isContextMenuCommand()) return null;

	return interaction.isMessageContextMenuCommand()
		? interaction.options.getMessage('message')
		: interaction.options.getUser('user');
});

export const TargetMessage = createParamDecorator((_, context) => {
	const necordContext = NecordExecutionContext.create(context);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (!interaction.isMessageContextMenuCommand()) return null;

	return interaction.targetMessage;
});

export const TargetUser = createParamDecorator((_, context) => {
	const necordContext = NecordExecutionContext.create(context);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (!interaction.isUserContextMenuCommand()) return null;

	return interaction.targetUser;
});

export const TargetMember = createParamDecorator((_, context) => {
	const necordContext = NecordExecutionContext.create(context);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (!interaction.isUserContextMenuCommand()) return null;

	return interaction.targetMember;
});
