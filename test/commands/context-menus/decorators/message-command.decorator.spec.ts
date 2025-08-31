import { ContextMenu, ContextMenuDiscovery, MessageCommand } from '../../../../src';
import { ApplicationCommandType } from 'discord-api-types/v10';

describe('@MessageCommand', () => {
	class Test {
		@MessageCommand({ name: 'MessageCommand' })
		messageCommand() {
			// message command logic
		}
	}

	it('should be defined', () => {
		expect(ContextMenu).toBeDefined();
		expect(ContextMenu.KEY).toBeDefined();
	});

	it('should attach metadata to the method for Message Command', () => {
		const metadata: ContextMenuDiscovery = Reflect.getMetadata(
			ContextMenu.KEY,
			Test.prototype['messageCommand']
		);

		expect(metadata).toBeDefined();
		expect(metadata.getType()).toBe(ApplicationCommandType.Message);
		expect(metadata.getName()).toBe('MessageCommand');
	});
});
