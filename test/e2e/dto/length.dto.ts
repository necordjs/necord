import { StringOption } from '../../../src';

export class LengthDto {
	@StringOption({
		name: 'text',
		description: 'Your text',
		required: true
	})
	public readonly text: string;
}
