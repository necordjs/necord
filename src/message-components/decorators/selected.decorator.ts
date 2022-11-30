import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
	ChannelSelectMenuInteraction,
	MentionableSelectMenuInteraction,
	RoleSelectMenuInteraction,
	UserSelectMenuInteraction
} from 'discord.js';
import { NecordExecutionContext } from '../../context';

export const SelectedStrings = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	return interaction.isStringSelectMenu() ? interaction.values : [];
});

export const SelectedChannels = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	return interaction.isChannelSelectMenu() ? interaction.channels : [];
});
export type ISelectedChannels = ChannelSelectMenuInteraction['channels'];

export const SelectedUsers = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (interaction.isUserSelectMenu() || interaction.isMentionableSelectMenu()) {
		return interaction.users;
	}

	return [];
});
export type ISelectedUsers =
	| UserSelectMenuInteraction['users']
	| MentionableSelectMenuInteraction['users'];

export const SelectedMembers = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (interaction.isUserSelectMenu() || interaction.isMentionableSelectMenu()) {
		return interaction.users;
	}
	return [];
});
export type ISelectedMembers =
	| UserSelectMenuInteraction['members']
	| MentionableSelectMenuInteraction['members'];

export const SelectedRoles = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (interaction.isRoleSelectMenu() || interaction.isMentionableSelectMenu()) {
		return interaction.roles;
	}

	return [];
});
export type ISelectedRoles =
	| RoleSelectMenuInteraction['roles']
	| MentionableSelectMenuInteraction['roles'];
