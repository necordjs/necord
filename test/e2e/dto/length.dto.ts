import { StringOption } from '../../../src/index.js';

export class LengthDto {
	@StringOption({
		name: 'text',
		description: 'Your text',
		required: true
	})
	public readonly text: string;
}
