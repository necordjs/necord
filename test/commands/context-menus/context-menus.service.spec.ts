import { ApplicationCommandType, Collection } from 'discord.js';
import { Logger } from '@nestjs/common';
import { ContextMenuDiscovery, ContextMenusService } from '../../../src';

describe('ContextMenusService', () => {
	let service: ContextMenusService;

	beforeEach(() => {
		service = new ContextMenusService();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should add a context menu to the cache and allow retrieving it', () => {
		const discovery = new ContextMenuDiscovery({ type: 2, name: 'MyMenu' });
		service.add(discovery);

		const got = service.get(2, 'MyMenu');
		expect(got).toBe(discovery);

		expect(service.cache).toBeInstanceOf(Collection);
		expect(service.cache.size).toBe(1);
	});

	it('should log a warning when adding the same id twice', () => {
		const discovery = new ContextMenuDiscovery({ type: 2, name: 'DuplicateMenu' });
		const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});

		service.add(discovery);
		service.add(discovery);

		expect(warnSpy).toHaveBeenCalledTimes(1);

		const got = service.get(2 as any, 'DuplicateMenu');
		expect(got).toBe(discovery);
		expect(service.cache.size).toBe(1);
	});

	it('should return undefined when trying to get a non-existing item', () => {
		const got = service.get(3 as any, 'Unknown');
		expect(got).toBeUndefined();
	});

	it('should remove an existing item and return true, and return false for a non-existing one', () => {
		const discovery = new ContextMenuDiscovery({
			type: ApplicationCommandType.User,
			name: 'ToRemove'
		});
		service.add(discovery);

		expect(service.remove(ApplicationCommandType.User, 'ToRemove')).toBe(true);
		expect(service.get(ApplicationCommandType.User, 'ToRemove')).toBeUndefined();

		expect(service.remove(ApplicationCommandType.User, 'ToRemove')).toBe(false);
	});

	it('should generate keys as "type:name" and distinguish same names with different types', () => {
		const a = new ContextMenuDiscovery({ type: ApplicationCommandType.User, name: 'SameName' });
		const b = new ContextMenuDiscovery({
			type: ApplicationCommandType.Message,
			name: 'SameName'
		});

		service.add(a);
		service.add(b);

		const keys = Array.from(service.cache.keys()).sort();
		expect(keys).toContain(`${ApplicationCommandType.User}:SameName`);
		expect(keys).toContain(`${ApplicationCommandType.Message}:SameName`);

		expect(service.get(ApplicationCommandType.User, 'SameName')).toBe(a);
		expect(service.get(ApplicationCommandType.Message, 'SameName')).toBe(b);
	});
});
