import { ModalDiscovery } from '../../src';

describe('ModalDiscovery', () => {
	it('should be defined', () => {
		const discovery = new ModalDiscovery({ customId: 'modal-:id' });
		expect(discovery).toBeDefined();
	});

	it('should have a customId', () => {
		const discovery = new ModalDiscovery({ customId: 'my-modal' });
		expect(discovery.getCustomId()).toBe('my-modal');
	});

	it('should typeguard as ModalDiscovery', () => {
		const discovery = new ModalDiscovery({ customId: 'typeguard' });
		expect(discovery.isModal()).toBeTruthy();
	});

	it('should convert to JSON', () => {
		const discovery = new ModalDiscovery({ customId: 'json-modal' });
		expect(discovery.toJSON()).toEqual({ customId: 'json-modal' });
	});
});
