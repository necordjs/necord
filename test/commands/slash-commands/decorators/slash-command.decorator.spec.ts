import { SlashCommand, SlashCommandDiscovery } from '../../../../src';

describe('@SlashCommand', () => {
	class Test {
		@SlashCommand({
			name: 'test',
			description: 'Test command'
		})
		testMethod() {
			return 'test-result';
		}
	}

	it('should add metadata to the method', () => {
		const metadata: SlashCommandDiscovery = Reflect.getMetadata(
			SlashCommand.KEY,
			Test.prototype['testMethod']
		);
		expect(metadata).toBeDefined();
		expect(metadata.getName()).toBe('test');
		expect(metadata.getDescription()).toBe('Test command');
	});
});
