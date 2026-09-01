import { SlashCommandDiscovery } from '../../../src/index.js';

describe('SlashCommandDiscovery', () => {
	it('should be defined', () => {
		expect(SlashCommandDiscovery).toBeDefined();
	});

	it('should create an instance', () => {
		const discovery = new SlashCommandDiscovery({
			name: 'test',
			description: 'Test command'
		});
		expect(discovery).toBeInstanceOf(SlashCommandDiscovery);
		expect(discovery.isSlashCommand()).toBe(true);
		expect(discovery.getName()).toBe('test');
		expect(discovery.getDescription()).toBe('Test command');
	});

	it('should execute', () => {
		const mockExecute = vi.fn<(...args: any[]) => any>();
		const discovery = new SlashCommandDiscovery({
			name: 'test',
			description: 'Test command'
		});
		discovery.setContextCallback(mockExecute);

		discovery.execute({} as any);

		expect(mockExecute).toHaveBeenCalledWith([{}], discovery);
	});

	it('should handle subcommands', () => {
		const intercationMock = {
			options: {
				getSubcommandGroup: vi.fn<(...args: any[]) => any>().mockReturnValue(null),
				getSubcommand: vi.fn<(...args: any[]) => any>().mockReturnValue('sub')
			},
			createdAt: new Date()
		};

		const mainCommand = new SlashCommandDiscovery({
			name: 'main',
			description: 'Main command'
		});

		const subCommand = new SlashCommandDiscovery({
			name: 'sub',
			description: 'Sub command'
		});

		mainCommand.setSubcommand(subCommand);

		expect(mainCommand.getSubcommand('sub')).toBe(subCommand);
		expect(mainCommand.getSubcommands().size).toBe(1);

		const mockExecute = vi.fn<(...args: any[]) => any>();
		subCommand.setContextCallback(mockExecute);

		mainCommand.execute(intercationMock as any, 1);

		expect(mockExecute).toHaveBeenCalled();
	});

	it('should handle subcommand groups with subcommands', () => {
		const intercationMock = {
			options: {
				getSubcommandGroup: vi.fn<(...args: any[]) => any>().mockReturnValue('group'),
				getSubcommand: vi.fn<(...args: any[]) => any>().mockReturnValue('sub')
			},
			createdAt: new Date()
		};

		const mainCommand = new SlashCommandDiscovery({
			name: 'main',
			description: 'Main command'
		});

		const subCommandGroup = new SlashCommandDiscovery({
			name: 'group',
			description: 'Subcommand group'
		});

		const subCommand = new SlashCommandDiscovery({
			name: 'sub',
			description: 'Sub command'
		});

		mainCommand.setSubcommand(subCommandGroup);
		subCommandGroup.setSubcommand(subCommand);

		expect(mainCommand.getSubcommand('group')).toBe(subCommandGroup);
		expect(mainCommand.getSubcommands().size).toBe(1);

		const mockExecute = vi.fn<(...args: any[]) => any>();
		subCommand.setContextCallback(mockExecute);

		mainCommand.execute(intercationMock as any, 1);

		expect(mockExecute).toHaveBeenCalled();
	});
});
