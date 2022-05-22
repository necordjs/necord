import { SetMetadata } from '@nestjs/common';
import { SlashCommandMeta } from '../discovery';
import { SLASH_COMMAND_METADATA, SLASH_GROUP_METADATA } from '../necord.constants';
import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

export const SlashGroup =
	(name: string, description: string): MethodDecorator & ClassDecorator =>
	(target, propertyKey?, descriptor?) => {
		SetMetadata(SLASH_GROUP_METADATA, {
			type: !propertyKey
				? ApplicationCommandType.ChatInput
				: ApplicationCommandOptionType.SubcommandGroup,
			name,
			description,
			options: []
		})(target, propertyKey, descriptor);
	};

export const SlashCommand = (name: string, description: string): MethodDecorator =>
	SetMetadata<string, SlashCommandMeta>(SLASH_COMMAND_METADATA, {
		type: ApplicationCommandType.ChatInput,
		name,
		description,
		options: []
	});

// export const createSubcommandGroupDecorator: ClassDecorator = () => true;
