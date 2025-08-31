import { Test } from '@nestjs/testing';
import { Client, Interaction } from 'discord.js';
import {
	NECORD_MODULE_OPTIONS,
	NecordExplorerService,
	NecordModule,
	SlashCommand,
	SlashCommandDiscovery,
	SlashCommandsModule,
	SlashCommandsService,
	Subcommand
} from '../../../src';

describe('SlashCommandsModule', () => {
	let client: Client;
	let slashCommandsService: SlashCommandsService;
	let slashCommandsModule: SlashCommandsModule;
	let explorerService: NecordExplorerService<SlashCommandDiscovery>;
	let emitInteractionCreate: (interaction: Partial<Interaction>) => void;

	beforeEach(async () => {
		client = new Client({ intents: [] });
		slashCommandsService = { add: jest.fn(), get: jest.fn() } as any;
		explorerService = {
			explore: jest.fn()
		} as any;

		const moduleRef = await Test.createTestingModule({
			imports: [NecordModule.forRoot({ intents: [], token: '' }), SlashCommandsModule]
		})
			.overrideProvider(NECORD_MODULE_OPTIONS)
			.useValue({})
			.overrideProvider(Client)
			.useValue(client)
			.overrideProvider(SlashCommandsService)
			.useValue(slashCommandsService)
			.overrideProvider(NecordExplorerService)
			.useValue(explorerService)
			.compile();

		slashCommandsModule = moduleRef.get(SlashCommandsModule);

		// simulate client.on('interactionCreate')
		emitInteractionCreate = interaction => {
			const listener = client.rawListeners('interactionCreate')[0];
			if (listener) listener(interaction);
		};
	});

	it('should add slash commands and subcommands on module init', () => {
		jest.spyOn(explorerService, 'explore')
			.mockReturnValueOnce([{ customId: 'test' }] as any)
			.mockReturnValueOnce([]);

		slashCommandsModule.onModuleInit();

		expect(explorerService.explore).toHaveBeenCalledWith(SlashCommand.KEY);
		expect(explorerService.explore).toHaveBeenCalledWith(Subcommand.KEY);
		expect(slashCommandsService.add).toHaveBeenCalledWith({ customId: 'test' });
	});

	it('should handle chat input interaction', () => {
		slashCommandsModule.onApplicationBootstrap();

		const execute = jest.fn();
		(slashCommandsService.get as jest.Mock).mockReturnValue({ execute });

		const interaction = {
			isChatInputCommand: () => true,
			customId: 'test'
		};

		emitInteractionCreate(interaction as any);
		expect(execute).toHaveBeenCalledWith(interaction);
	});

	it('should ignore non-chat input interactions', () => {
		slashCommandsModule.onApplicationBootstrap();

		emitInteractionCreate({
			isChatInputCommand: () => false,
			isAutocomplete: () => false
		} as any);

		expect(slashCommandsService.get).not.toHaveBeenCalled();
	});
});
