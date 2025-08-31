import { TextCommandDiscovery } from '../../src';

describe('TextCommandDiscovery', () => {
	it('should be defined', () => {
		const discovery = new TextCommandDiscovery({
			name: 'test-command',
			description: 'A test command'
		});

		expect(discovery).toBeDefined();
	});

	it('should have a name and description', () => {
		const discovery = new TextCommandDiscovery({
			name: 'test-command',
			description: 'A test command'
		});

		expect(discovery.getName()).toBe('test-command');
		expect(discovery.getDescription()).toBe('A test command');
	});

	it('should typeguard as TextCommandDiscovery', () => {
		const discovery = new TextCommandDiscovery({
			name: 'parent-command',
			description: 'A parent command'
		});

		expect(discovery.isTextCommand()).toBeTruthy();
	});

	it('should convert to JSON', () => {
		const discovery = new TextCommandDiscovery({
			name: 'json-command',
			description: 'A command for JSON'
		});

		expect(discovery.toJSON()).toEqual({
			name: 'json-command',
			description: 'A command for JSON'
		});
	});
});
