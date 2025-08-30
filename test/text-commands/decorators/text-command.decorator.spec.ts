import { TextCommand, TextCommandDiscovery } from '../../../src';

describe('@TextCommand', () => {
	class Test {
		@TextCommand({ name: 'test', description: 'A test command' })
		public execute() {
			return 'Executed';
		}
	}

	it('should be defined', () => {
		expect(TextCommand).toBeDefined();
		expect(TextCommand.KEY).toBeDefined();
	});

	it('should create a command with the correct properties', () => {
		const metadata = Reflect.getMetadata(TextCommand.KEY, Test.prototype['execute']);

		expect(metadata).toBeInstanceOf(TextCommandDiscovery);
		expect(metadata.getName()).toBe('test');
		expect(metadata.getDescription()).toBe('A test command');
	});
});
