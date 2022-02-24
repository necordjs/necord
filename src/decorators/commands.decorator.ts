import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';
import { APPLICATION_COMMAND_METADATA, GROUP_METADATA } from '../necord.constants';
import { SetMetadata } from '@nestjs/common';
import { ContextMenuMetadata, SlashCommandMetadata } from '../interfaces';

export const SlashGroup =
	(
		name: string,
		description: string,
		defaultPermission = true
	): MethodDecorator & ClassDecorator =>
	(target, propertyKey?, descriptor?) => {
		SetMetadata(GROUP_METADATA, {
			type: !propertyKey
				? ApplicationCommandTypes.CHAT_INPUT
				: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
			name,
			description,
			options: [],
			defaultPermission
		})(target, propertyKey, descriptor);
	};

export const SlashCommand = (
	name: string,
	description: string,
	defaultPermission = true
): MethodDecorator =>
	SetMetadata<string, SlashCommandMetadata>(APPLICATION_COMMAND_METADATA, {
		type: ApplicationCommandTypes.CHAT_INPUT,
		name,
		description,
		defaultPermission,
		options: []
	});

const createNecordContextMenu =
	(type: ContextMenuMetadata['type']) =>
	(name: string): MethodDecorator =>
		SetMetadata<string, ContextMenuMetadata>(APPLICATION_COMMAND_METADATA, {
			type,
			name
		});

export const UserCommand = createNecordContextMenu('USER');

export const MessageCommand = createNecordContextMenu('MESSAGE');
