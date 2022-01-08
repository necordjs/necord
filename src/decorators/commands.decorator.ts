import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';
import {
	GROUP_METADATA,
	SIMPLE_COMMAND_METADATA,
	SLASH_COMMAND_METADATA
} from '../necord.constants';
import { SetMetadata } from '@nestjs/common';
import { SimpleCommandMetadata } from '../interfaces';

export const SlashCommand = (name: string, description: string): MethodDecorator =>
	SetMetadata(SLASH_COMMAND_METADATA, {
		type: ApplicationCommandTypes.CHAT_INPUT,
		name,
		description
	});

export const SimpleCommand = (name: string, description?: string) =>
	SetMetadata<string, SimpleCommandMetadata>(SIMPLE_COMMAND_METADATA, {
		name,
		description
	});

export const CommandGroup = (
	name: string,
	description: string
): MethodDecorator & ClassDecorator => {
	return (target, propertyKey?, descriptor?) => {
		SetMetadata(GROUP_METADATA, {
			type: !propertyKey
				? ApplicationCommandTypes.CHAT_INPUT
				: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
			name,
			description,
			options: []
		})(target, propertyKey, descriptor);
	};
};
