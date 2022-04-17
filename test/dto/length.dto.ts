import { NumberOption } from '../../src';

export class LengthDto {
	@NumberOption({
		name: 'text',
		description: 'Your text',
		required: true
	})
	public readonly text: string;
}
