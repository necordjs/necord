import { TextCommandDiscovery, TextCommandsService } from '../../src';

describe('TextCommandsService', () => {
	let service: TextCommandsService;

	beforeEach(() => {
		service = new TextCommandsService();
	});

	it('should add a text command', () => {
		const command = new TextCommandDiscovery({
			name: 'test-command',
			description: 'A test command'
		});
		service.add(command);

		expect(service.cache.has('test-command')).toBe(true);
		expect(service.get('test-command')).toBe(command);
	});

	it('should warn if a command is already added', () => {
		const loggerWarnSpy = jest.spyOn(service['logger'], 'warn').mockImplementation();
		const command = new TextCommandDiscovery({
			name: 'duplicate-command',
			description: 'A duplicate command'
		});

		service.add(command);
		service.add(command);

		expect(loggerWarnSpy).toHaveBeenCalledWith(
			`TextCommand : ${command.getName()} already exists`
		);
	});

	it('should get a text command by name', () => {
		const command = new TextCommandDiscovery({
			name: 'get-command',
			description: 'A command to get'
		});

		service.add(command);

		const result = service.get('get-command');
		expect(result).toBe(command);
	});

	it('should remove a text command by name', () => {
		const command = new TextCommandDiscovery({
			name: 'remove-command',
			description: 'A command to remove'
		});

		service.add(command);

		service.remove('remove-command');
		expect(service.get('remove-command')).toBeUndefined();
	});
});
