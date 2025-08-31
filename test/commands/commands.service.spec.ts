import { CommandsService, ContextMenuDiscovery, SlashCommandDiscovery } from '../../src';
import { ApplicationCommandType, Collection } from 'discord.js';

class Test {
	method() {}
}

describe('CommandsService', () => {
	let service: CommandsService;

	const clientMock = {
		application: {
			commands: {
				set: jest.fn().mockResolvedValue([])
			}
		}
	} as any;

	const contextMenusServiceMock = {
		cache: new Collection([
			['test', new ContextMenuDiscovery({ name: 'test', type: ApplicationCommandType.User })]
		])
	} as any;

	const slashCommandsServiceMock = {
		cache: new Collection([
			['test', new SlashCommandDiscovery({ name: 'test', description: 'test', guilds: [] })],
			[
				'guildTest',
				new SlashCommandDiscovery({
					name: 'guildTest',
					description: 'guildTest',
					guilds: ['1']
				})
			]
		])
	} as any;

	beforeAll(async () => {
		service = new CommandsService(
			clientMock,
			contextMenusServiceMock,
			slashCommandsServiceMock
		);

		service.getCommands().forEach(command => {
			command.setDiscoveryMeta({
				class: Test,
				handler: Test.prototype.method
			});
		});
	});

	it('should be defined', () => {
		expect(CommandsService).toBeDefined();
		expect(service).toBeDefined();
	});

	it('should register all commands', async () => {
		const registerGlobalCommandsSpy = jest.spyOn(service, 'registerGlobalCommands');
		const registerGuildCommandsSpy = jest.spyOn(service, 'registerCommandsInGuild');

		await service.registerAllCommands();

		expect(registerGlobalCommandsSpy).toHaveBeenCalled();
		expect(registerGuildCommandsSpy).toHaveBeenCalled();
	});

	it('should register global commands', async () => {
		const globalCommands = service.getGlobalCommands();
		await service.registerGlobalCommands();

		expect(clientMock.application.commands.set).toHaveBeenCalledWith(
			globalCommands.flatMap(cmd => cmd.toJSON())
		);
	});

	it('should get all commands', () => {
		const commands = service.getCommands();

		expect(commands).toHaveLength(3);
	});

	it('should get global commands', () => {
		const globalCommands = service.getGlobalCommands();

		expect(globalCommands).toHaveLength(2);
		expect(globalCommands.every(cmd => cmd.isGlobal())).toBe(true);
	});

	it('should get commands grouped by guilds', () => {
		const commandsByGuilds = service.getCommandsGroupedByGuilds();

		expect(commandsByGuilds.size).toBe(1);
		expect(commandsByGuilds.get('1')).toBeDefined();
		expect(commandsByGuilds.get('1')).toHaveLength(1);
	});

	it('should register commands in a guild', async () => {
		const guildCommands = service.getCommandsGroupedByGuilds().get('1') || [];
		await service.registerCommandsInGuild('1', guildCommands);

		expect(clientMock.application.commands.set).toHaveBeenCalledWith(
			guildCommands.flatMap(cmd => cmd.toJSON()),
			'1'
		);
	});

	it('should throw if no guild ID is provided when registering guild commands', async () => {
		await expect(service.registerCommandsInGuild('', [])).rejects.toThrow(
			'Guild ID is required to register guild commands.'
		);
	});

	afterEach(async () => {
		jest.restoreAllMocks();
	});
});
