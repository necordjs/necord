import { Test, TestingModule } from '@nestjs/testing';
import {
	CommandsModule,
	CommandsService,
	ContextMenuDiscovery,
	NECORD_MODULE_OPTIONS,
	NecordModule,
	SlashCommandDiscovery
} from '../../src';
import { ApplicationCommandType, Client } from 'discord.js';

describe('CommandsModule', () => {
	let moduleRef: TestingModule;
	let module: CommandsModule;

	const clientMock = {
		on: jest.fn(),
		once: jest.fn(),
		application: { partial: false, fetch: jest.fn() }
	};
	const optionsMock = { skipRegistration: false, development: [] };
	const commandsServiceMock = { registerAllCommands: jest.fn(), getCommands: jest.fn() };

	let emitReady: () => void;

	beforeEach(async () => {
		moduleRef = await Test.createTestingModule({
			imports: [NecordModule.forRoot({ intents: [], token: '' }), CommandsModule]
		})
			.overrideProvider(Client)
			.useValue(clientMock)
			.overrideProvider(NECORD_MODULE_OPTIONS)
			.useValue(optionsMock)
			.overrideProvider(CommandsService)
			.useValue(commandsServiceMock)
			.compile();

		module = moduleRef.get(CommandsModule);

		emitReady = () => {
			const listener = clientMock.once.mock.calls.find(
				call => call[0] === 'clientReady'
			)?.[1];
			if (listener) listener();
		};
	});

	it('should be defined', () => {
		expect(module).toBeDefined();
	});

	describe('onModuleInit', () => {
		describe('when skipRegistration is true', () => {
			beforeEach(() => {
				optionsMock.skipRegistration = true;
			});

			it('should not register commands', () => {
				module.onModuleInit();
				expect(clientMock.once).not.toHaveBeenCalled();
			});
		});

		describe('when skipRegistration is false', () => {
			beforeEach(() => {
				optionsMock.skipRegistration = false;
			});

			it('should register commands on client ready', () => {
				module.onModuleInit();
				expect(clientMock.once).toHaveBeenCalledWith('clientReady', expect.any(Function));
			});

			it('should handle ready event and register commands', async () => {
				module.onModuleInit();

				emitReady();

				expect(commandsServiceMock.registerAllCommands).toHaveBeenCalled();
			});

			it('should fetch application if partial', async () => {
				clientMock.application.partial = true;
				module.onModuleInit();

				emitReady();

				expect(clientMock.application.fetch).toHaveBeenCalled();
			});

			it('should not fetch application if not partial', async () => {
				clientMock.application.partial = false;
				module.onModuleInit();

				emitReady();

				expect(clientMock.application.fetch).not.toHaveBeenCalled();
			});
		});
	});

	describe('onApplicationBootstrap', () => {
		describe('when development is not an array', () => {
			beforeEach(() => {
				optionsMock.development = undefined;
			});

			it('should not override command guilds', () => {
				const loggerSpy = jest.spyOn(module['logger'], 'debug').mockImplementation();
				module.onApplicationBootstrap();
				expect(loggerSpy).not.toHaveBeenCalled();
			});
		});

		describe('when development is an array', () => {
			beforeEach(() => {
				optionsMock.development = ['guild1', 'guild2'];
				commandsServiceMock.getCommands.mockReturnValue([
					new ContextMenuDiscovery({
						name: 'cmd1',
						type: ApplicationCommandType.User,
						guilds: ['oldGuild']
					}),
					new SlashCommandDiscovery({
						name: 'cmd2',
						description: 'desc'
					})
				]);
			});

			it('should override command guilds and log debug message', () => {
				const loggerSpy = jest.spyOn(module['logger'], 'debug').mockImplementation();
				module.onApplicationBootstrap();
				expect(loggerSpy).toHaveBeenCalledWith(
					'Running in development mode, overriding guilds to all commands'
				);

				const commands = commandsServiceMock.getCommands();
				expect(commands[0].getGuilds()).toEqual(['guild1', 'guild2']);
				expect(commands[1].getGuilds()).toEqual(['guild1', 'guild2']);
			});
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
});
