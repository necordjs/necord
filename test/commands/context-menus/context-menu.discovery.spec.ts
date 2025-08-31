import { ContextMenuDiscovery } from '../../../src';
import { ApplicationCommandType } from 'discord.js';

describe('ContextMenuDiscovery', () => {
	it('should be defined', () => {
		expect(ContextMenuDiscovery).toBeDefined();
	});

	it.each([ApplicationCommandType.Message, ApplicationCommandType.User])(
		'should create an instance (%s)',
		(type: ApplicationCommandType.User | ApplicationCommandType.Message) => {
			const discovery = new ContextMenuDiscovery({
				name: 'test',
				type
			});
			expect(discovery).toBeInstanceOf(ContextMenuDiscovery);
			expect(discovery.getType()).toBe(type);
			expect(discovery.isContextMenu()).toBe(true);
			expect(discovery.toJSON()).toEqual({ name: 'test', type });
		}
	);

	it('should execute', () => {
		const mockExecute = jest.fn();
		const discovery = new ContextMenuDiscovery({
			name: 'test',
			type: ApplicationCommandType.User
		});
		discovery.setContextCallback(mockExecute);

		discovery.execute({} as any);

		expect(mockExecute).toHaveBeenCalledWith([{}], discovery);
	});
});
