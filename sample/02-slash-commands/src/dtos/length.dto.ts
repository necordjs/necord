import { StringOption } from 'necord';

export class LengthDto {
	@StringOption({
		name: 'text',
		description: 'Your text',
		required: true
	})
	text: string;
}
