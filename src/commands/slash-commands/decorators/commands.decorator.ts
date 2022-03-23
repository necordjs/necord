import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';
import { SetMetadata } from '@nestjs/common';
import { SLASH_COMMAND_METADATA, SLASH_GROUP_METADATA } from '../../commands.constants';
import { SlashCommandMeta } from '../slash-command.discovery';

export const SlashGroup =
	(
		name: string,
		description: string,
		defaultPermission = true
	): MethodDecorator & ClassDecorator =>
	(target, propertyKey?, descriptor?) => {
		SetMetadata(SLASH_GROUP_METADATA, {
			type: !propertyKey
				? ApplicationCommandTypes.CHAT_INPUT
				: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
			name,
			description,
			defaultPermission,
			options: []
		})(target, propertyKey, descriptor);
	};

export const SlashCommand = (
	name: string,
	description: string,
	defaultPermission = true
): MethodDecorator =>
	SetMetadata<string, SlashCommandMeta>(SLASH_COMMAND_METADATA, {
		type: ApplicationCommandTypes.CHAT_INPUT,
		name,
		description,
		defaultPermission,
		options: []
	});
