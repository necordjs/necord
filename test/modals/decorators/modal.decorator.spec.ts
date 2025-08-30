import { Modal, ModalDiscovery } from '../../../src';

describe('@Modal', () => {
	class Test {
		@Modal('test')
		public execute() {
			return 'Executed';
		}
	}

	it('should be defined', () => {
		expect(Modal).toBeDefined();
		expect(Modal.KEY).toBeDefined();
	});

	it('should create a modal with the correct properties', () => {
		const metadata: ModalDiscovery = Reflect.getMetadata(Modal.KEY, Test.prototype['execute']);

		expect(metadata).toBeInstanceOf(ModalDiscovery);
		expect(metadata.getCustomId()).toBe('test');
	});
});
