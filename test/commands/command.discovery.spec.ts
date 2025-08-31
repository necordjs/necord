import { CommandDiscovery } from '../../src';

class TestCommandDiscovery extends CommandDiscovery {
	public toJSON(): Record<string, any> {
		return this.meta;
	}
}

describe('Discovery command', () => {
	it('should be defined', () => {
		expect(CommandDiscovery).toBeDefined();
	});

	it('should create a command discovery with the correct properties', () => {
		const command = new TestCommandDiscovery({
			name: 'test'
		});

		expect(command).toBeInstanceOf(CommandDiscovery);
		expect(command.getName()).toBe('test');
		expect(command.toJSON()).toEqual({
			name: 'test'
		});
	});

	it('should set and get guilds', () => {
		const command = new TestCommandDiscovery({
			name: 'test'
		});

		command.setGuilds(['123', '456']);
		expect(command.getGuilds()).toEqual(['123', '456']);
		expect(command.hasGuild('123')).toBe(true);
		expect(command.hasGuild('789')).toBe(false);
	});
});
