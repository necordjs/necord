import { MessageComponentDiscovery } from '../../src';
import { ComponentType } from 'discord-api-types/v10';

describe('MessageComponentDiscovery', () => {
	it('should be defined', () => {
		const discovery = new MessageComponentDiscovery({
			type: ComponentType.Button,
			customId: 'modal-:id'
		});
		expect(discovery).toBeDefined();
	});

	it('should have a customId', () => {
		const discovery = new MessageComponentDiscovery({
			type: ComponentType.Button,
			customId: 'my-modal'
		});
		expect(discovery.getCustomId()).toBe('my-modal');
	});

	it('should typeguard as MessageComponentDiscovery', () => {
		const discovery = new MessageComponentDiscovery({
			type: ComponentType.Button,
			customId: 'typeguard'
		});
		expect(discovery.isMessageComponent()).toBeTruthy();
	});

	it('should convert to JSON', () => {
		const discovery = new MessageComponentDiscovery({
			type: ComponentType.Button,
			customId: 'json-modal'
		});
		expect(discovery.toJSON()).toEqual({
			customId: 'json-modal',
			type: ComponentType.Button
		});
	});
});
