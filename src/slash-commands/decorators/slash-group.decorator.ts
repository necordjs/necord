import { SetMetadata } from '@nestjs/common';
import { SLASH_GROUP_METADATA } from '../../necord.constants';
import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';

// TODO: TIME TO REMOVE THIS
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
