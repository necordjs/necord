import { Subcommand, SlashCommandDiscovery } from '../../../../src';

describe('@Subcommand', () => {
	class Test {
		@Subcommand({
			name: 'test',
			description: 'Test command'
		})
		testMethod() {
			return 'test-result';
		}
	}

	it('should add metadata to the method', () => {
		const metadata: SlashCommandDiscovery = Reflect.getMetadata(
			Subcommand.KEY,
			Test.prototype['testMethod']
		);
		expect(metadata).toBeDefined();
		expect(metadata.getName()).toBe('test');
		expect(metadata.getDescription()).toBe('Test command');
	});
});
