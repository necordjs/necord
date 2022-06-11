import { ApplicationCommandOptionType, APIApplicationCommandAttachmentOption } from 'discord.js';
import { createOptionDecorator } from './option.util';

export const AttachmentOption = createOptionDecorator<APIApplicationCommandAttachmentOption>(
	ApplicationCommandOptionType.Attachment,
	'getAttachment'
);
