import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NecordExecutionContext } from '../../context';

export const SelectedChannels = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	return interaction.isChannelSelectMenu() ? interaction.channels : [];
});

export const SelectedUsers = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (interaction.isUserSelectMenu() || interaction.isMentionableSelectMenu()) {
		return interaction.users;
	}

	return [];
});

export const SelectedMembers = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (interaction.isUserSelectMenu() || interaction.isMentionableSelectMenu()) {
		return interaction.users;
	}
	return [];
});

export const SelectedRoles = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (interaction.isRoleSelectMenu() || interaction.isMentionableSelectMenu()) {
		return interaction.roles;
	}

	return [];
});
