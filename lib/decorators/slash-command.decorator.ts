import { SetMetadata } from '@nestjs/common';
import { GROUP_METADATA, APPLICATION_COMMAND_METADATA } from '../necord.constants';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';

export const CommandGroup = (group?: string) => SetMetadata(GROUP_METADATA, group ?? null);

export const SlashCommand = (name: string, description?: string): MethodDecorator =>
	SetMetadata(APPLICATION_COMMAND_METADATA, { type: ApplicationCommandTypes.CHAT_INPUT, name, description });

export const SlashSubCommand = (subGroup: string, name: string, description?: string): MethodDecorator =>
	SetMetadata(APPLICATION_COMMAND_METADATA, {
		type: ApplicationCommandTypes.CHAT_INPUT,
		name,
		description,
		subGroup
	});
