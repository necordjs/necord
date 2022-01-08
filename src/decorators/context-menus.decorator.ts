import { ApplicationCommandTypes } from 'discord.js/typings/enums';
import { CONTEXT_MENU_METADATA } from '../necord.constants';
import { SetMetadata } from '@nestjs/common';

export const UserCommand = (name: string): MethodDecorator =>
	SetMetadata(CONTEXT_MENU_METADATA, {
		type: ApplicationCommandTypes.USER,
		name
	});

export const MessageCommand = (name: string): MethodDecorator =>
	SetMetadata(CONTEXT_MENU_METADATA, {
		type: ApplicationCommandTypes.MESSAGE,
		name
	});
