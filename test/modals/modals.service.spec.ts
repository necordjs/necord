import { ModalDiscovery, ModalsService } from '../../src';

describe('ModalsService', () => {
	let service: ModalsService;

	beforeEach(() => {
		service = new ModalsService();
	});

	it('should add a modal', () => {
		const modal = new ModalDiscovery({ customId: 'test-modal' });
		service.add(modal);

		expect(service.cache.has('test-modal')).toBe(true);
		expect(service.get('test-modal')).toBe(modal);
	});

	it('should warn if a modal is already added', () => {
		const loggerWarnSpy = jest.spyOn(service['logger'], 'warn').mockImplementation();
		const modal = new ModalDiscovery({ customId: 'duplicate-modal' });

		service.add(modal);
		service.add(modal);

		expect(loggerWarnSpy).toHaveBeenCalledWith(`Modal : ${modal.getCustomId()} already exists`);
	});

	it('should get a modal by matching customId', () => {
		const modal = new ModalDiscovery({ customId: 'modal-:id' });
		service.add(modal);

		const result = service.get('modal-123');
		expect(result).toBe(modal);
	});

	it('should return undefined when no modal matches', () => {
		const modal = new ModalDiscovery({ customId: 'another-:id' });
		service.add(modal);

		const result = service.get('no-match');
		expect(result).toBeUndefined();
	});

	it('should remove a modal by customId', () => {
		const modal = new ModalDiscovery({ customId: 'remove-me' });
		service.add(modal);

		service.remove('remove-me');
		expect(service.get('remove-me')).toBeUndefined();
	});
});
