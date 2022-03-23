import { StringOption } from '../../src';

export class TestDto {
	@StringOption({
		name: 'zc',
		description: 'Your text',
		required: true
	})
	text: string;
}

export class LengthDto extends TestDto {
	@StringOption({
		name: 'text',
		description: 'Your text',
		required: true
	})
	text: string;
}
