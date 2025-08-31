import { ContextMenu, ContextMenuDiscovery } from '../../../../src';
import { ApplicationCommandType } from 'discord-api-types/v10';

describe('@ContextMenu', () => {
	class Test {
		@ContextMenu({ type: ApplicationCommandType.User, name: 'TestUser' })
		userCommand() {
			// user command logic
		}

		@ContextMenu({ type: ApplicationCommandType.Message, name: 'TestMessage' })
		messageCommand() {
			// message command logic
		}
	}

	it('should be defined', () => {
		expect(ContextMenu).toBeDefined();
		expect(ContextMenu.KEY).toBeDefined();
	});

	it('should attach metadata to the method for User Command', () => {
		const metadata: ContextMenuDiscovery = Reflect.getMetadata(
			ContextMenu.KEY,
			Test.prototype['userCommand']
		);

		expect(metadata).toBeDefined();
		expect(metadata.getType()).toBe(ApplicationCommandType.User);
		expect(metadata.getName()).toBe('TestUser');
	});

	it('should attach metadata to the method for Message Command', () => {
		const metadata: ContextMenuDiscovery = Reflect.getMetadata(
			ContextMenu.KEY,
			Test.prototype['messageCommand']
		);

		expect(metadata).toBeDefined();
		expect(metadata.getType()).toBe(ApplicationCommandType.Message);
		expect(metadata.getName()).toBe('TestMessage');
	});
});
