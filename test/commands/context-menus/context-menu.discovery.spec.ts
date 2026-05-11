import { ApplicationCommandType } from 'discord.js';

import { ContextMenuDiscovery } from '../../../src';

describe('ContextMenuDiscovery', () => {
	it('should be defined', () => {
		expect(ContextMenuDiscovery).toBeDefined();
	});

	it.each<ApplicationCommandType.User | ApplicationCommandType.Message>([
		ApplicationCommandType.Message,
		ApplicationCommandType.User
	])('should create an instance (%s)', type => {
		const discovery = new ContextMenuDiscovery({
			name: 'test',
			type
		});
		expect(discovery).toBeInstanceOf(ContextMenuDiscovery);
		expect(discovery.getType()).toBe(type);
		expect(discovery.isContextMenu()).toBe(true);
		expect(discovery.toJSON()).toEqual({ name: 'test', type });
	});

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
