import { createOptionDecorator, OPTIONS_METADATA } from '../../../../src';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

describe('createOptionDecorator', () => {
	const IntOption = createOptionDecorator(ApplicationCommandOptionType.Integer, 'getInteger');

	class TestOptions {
		@IntOption({ name: 'testInt', description: 'A test integer option', required: true })
		public testInt!: number;
	}

	it('should create a property decorator', () => {
		const metadata = Reflect.getOwnMetadata(OPTIONS_METADATA, TestOptions.prototype);
		expect(metadata).toBeDefined();
		expect(metadata.testInt).toEqual({
			name: 'testInt',
			description: 'A test integer option',
			required: true,
			type: ApplicationCommandOptionType.Integer,
			resolver: 'getInteger'
		});
	});

	it('should apply metadata to the target class', () => {
		const instance = new TestOptions();
		expect(instance).toBeInstanceOf(TestOptions);
		expect(instance.testInt).toBeUndefined();
	});
});
