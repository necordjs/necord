import { MessageComponent, MessageComponentDiscovery } from '../../../src';
import { ComponentType } from 'discord-api-types/v10';

describe('@MessageComponent', () => {
	class Test {
		@MessageComponent({ type: ComponentType.Button, customId: 'test' })
		public execute() {
			return 'Executed';
		}
	}

	it('should be defined', () => {
		expect(MessageComponent).toBeDefined();
		expect(MessageComponent.KEY).toBeDefined();
	});

	it('should create a message component with the correct properties', () => {
		const metadata: MessageComponentDiscovery = Reflect.getMetadata(
			MessageComponent.KEY,
			Test.prototype['execute']
		);

		expect(metadata).toBeInstanceOf(MessageComponentDiscovery);
		expect(metadata.getCustomId()).toBe('test');
	});
});
