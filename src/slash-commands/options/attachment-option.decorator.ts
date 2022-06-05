import { APIApplicationCommandAttachmentOption } from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const AttachmentOption = createOptionDecorator<APIApplicationCommandAttachmentOption>(
	ApplicationCommandOptionType.Attachment,
	'getAttachment'
);
