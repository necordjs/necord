import { SetMetadata } from '@nestjs/common';
import { GROUP_METADATA, SUBGROUP_METADATA } from '../necord.constants';
import { ApplicationCommandSubGroupData, ChatInputApplicationCommandData } from 'discord.js';
import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';

export const CommandGroup = (data?: Omit<ChatInputApplicationCommandData, 'type' | 'options'>) =>
	SetMetadata<string, ChatInputApplicationCommandData>(GROUP_METADATA, {
		type: ApplicationCommandTypes.CHAT_INPUT,
		options: [],
		...data
	});

export const CommandSubGroup = (data?: Omit<ApplicationCommandSubGroupData, 'type' | 'options'>) =>
	SetMetadata<string, ApplicationCommandSubGroupData>(SUBGROUP_METADATA, {
		type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
		options: [],
		...data
	});
