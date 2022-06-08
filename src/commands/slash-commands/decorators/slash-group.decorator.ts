import { SetMetadata } from '@nestjs/common';
import { SLASH_GROUP_METADATA } from '../../../necord.constants';
import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
import { SlashCommandMeta } from '../slash-command.discovery';

// TODO: TIME TO REMOVE THIS
export const SlashGroup =
	(options: Omit<SlashCommandMeta, 'type'>): MethodDecorator & ClassDecorator =>
	(target, propertyKey?, descriptor?) => {
		SetMetadata(SLASH_GROUP_METADATA, {
			type: !propertyKey
				? ApplicationCommandType.ChatInput
				: ApplicationCommandOptionType.SubcommandGroup,
			...options
		})(target, propertyKey, descriptor);
	};
