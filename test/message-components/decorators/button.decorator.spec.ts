import { Button, MessageComponent, MessageComponentDiscovery } from '../../../src';

describe('@Button', () => {
	class Test {
		@Button('test')
		public execute() {
			return 'Executed';
		}
	}

	it('should be defined', () => {
		expect(Button).toBeDefined();
	});

	it('should create a button with the correct properties', () => {
		const metadata: MessageComponentDiscovery = Reflect.getMetadata(
			MessageComponent.KEY,
			Test.prototype['execute']
		);

		expect(metadata).toBeInstanceOf(MessageComponentDiscovery);
		expect(metadata.getCustomId()).toBe('test');
	});
});
