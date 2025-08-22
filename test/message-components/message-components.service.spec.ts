import { MessageComponentDiscovery, MessageComponentsService, ModalDiscovery } from '../../src';
import { ComponentType } from 'discord-api-types/v10';
import { MessageComponentType } from 'discord.js';

describe('MessageComponentsService', () => {
	let service: MessageComponentsService;

	beforeEach(() => {
		service = new MessageComponentsService();
	});

	const componentName = (type: MessageComponentType, customId: string): string => {
		return [type, customId].join('_');
	};

	it.each([
		[ComponentType.Button, 'button-:id'],
		[ComponentType.UserSelect, 'user-select-:id'],
		[ComponentType.StringSelect, 'string-select-:id'],
		[ComponentType.RoleSelect, 'role-select-:id'],
		[ComponentType.MentionableSelect, 'mentionable-select-:id'],
		[ComponentType.ChannelSelect, 'channel-select-:id']
	])('should add a %s component with customId %s', (type: MessageComponentType, customId) => {
		const component = new MessageComponentDiscovery({ type, customId });

		service.add(component);

		expect(service.cache.has(componentName(type, customId))).toBe(true);
	});

	it('should warn if a component is already added', () => {
		const loggerWarnSpy = jest.spyOn(service['logger'], 'warn').mockImplementation();
		const type = ComponentType.Button;
		const customId = 'duplicate-button';
		const component = new MessageComponentDiscovery({ type, customId });

		service.add(component);
		service.add(component);

		expect(loggerWarnSpy).toHaveBeenCalledWith(
			`Message Component : ${componentName(type, customId)} already exists`
		);
	});

	it('should get a component by matching type and customId', () => {
		const type = ComponentType.Button;
		const customId = ':id';
		const component = new MessageComponentDiscovery({ type, customId });

		service.add(component);

		const result = service.get(type, '123');
		expect(result).toBe(component);
	});

	it('should return undefined when no component matches', () => {
		const result = service.get(ComponentType.Button, 'not-found');
		expect(result).toBeUndefined();
	});

	it('should remove a component by type and customId', () => {
		const type = ComponentType.Button;
		const customId = 'remove-me';
		const component = new MessageComponentDiscovery({ type, customId });

		service.add(component);

		service.remove(type, customId);
		expect(service.get(type, customId)).toBeUndefined();
	});
});
