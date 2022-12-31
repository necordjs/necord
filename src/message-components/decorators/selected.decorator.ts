import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
	ChannelSelectMenuInteraction,
	Collection,
	MentionableSelectMenuInteraction,
	RoleSelectMenuInteraction,
	UserSelectMenuInteraction
} from 'discord.js';
import { NecordExecutionContext } from '../../context';

export const SelectedStrings = createParamDecorator<any, any, string[]>(
	(_, ctx: ExecutionContext) => {
		const necordContext = NecordExecutionContext.create(ctx);
		const [interaction] = necordContext.getContext<'interactionCreate'>();

		return interaction.isStringSelectMenu() ? interaction.values : [];
	}
);

export type ISelectedChannels = ChannelSelectMenuInteraction['channels'];
export const SelectedChannels = createParamDecorator<any, any, ISelectedChannels>(
	(_, ctx: ExecutionContext) => {
		const necordContext = NecordExecutionContext.create(ctx);
		const [interaction] = necordContext.getContext<'interactionCreate'>();

		return interaction.isChannelSelectMenu() ? interaction.channels : new Collection();
	}
);

export type ISelectedUsers =
	| UserSelectMenuInteraction['users']
	| MentionableSelectMenuInteraction['users'];
export const SelectedUsers = createParamDecorator<any, any, ISelectedUsers>(
	(_, ctx: ExecutionContext) => {
		const necordContext = NecordExecutionContext.create(ctx);
		const [interaction] = necordContext.getContext<'interactionCreate'>();

		if (interaction.isUserSelectMenu() || interaction.isMentionableSelectMenu()) {
			return interaction.users;
		}

		return new Collection();
	}
);

export type ISelectedMembers =
	| UserSelectMenuInteraction['members']
	| MentionableSelectMenuInteraction['members'];
export const SelectedMembers = createParamDecorator<any, any, ISelectedMembers>(
	(_, ctx: ExecutionContext) => {
		const necordContext = NecordExecutionContext.create(ctx);
		const [interaction] = necordContext.getContext<'interactionCreate'>();

		if (interaction.isUserSelectMenu() || interaction.isMentionableSelectMenu()) {
			return interaction.members;
		}
		return new Collection();
	}
);

export type ISelectedRoles =
	| RoleSelectMenuInteraction['roles']
	| MentionableSelectMenuInteraction['roles'];
export const SelectedRoles = createParamDecorator<any, any, ISelectedRoles>(
	(_, ctx: ExecutionContext) => {
		const necordContext = NecordExecutionContext.create(ctx);
		const [interaction] = necordContext.getContext<'interactionCreate'>();

		if (interaction.isRoleSelectMenu() || interaction.isMentionableSelectMenu()) {
			return interaction.roles;
		}

		return new Collection();
	}
);
