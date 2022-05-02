import { AttachmentOption, StringOption } from '../../src';
import { Attachment } from 'discord.js';

export class LengthDto {
	@StringOption({
		name: 'text',
		description: 'Your text',
		required: true
	})
	public readonly text: string;

	@AttachmentOption({
		name: 'dick',
		description: 'You dick picture'
	})
	public readonly pic: Attachment;
}
