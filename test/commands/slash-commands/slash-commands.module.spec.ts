import type { Mock } from 'vitest';

import { Client, Interaction } from 'discord.js';
import { Test } from '@nestjs/testing';

import {
	NECORD_MODULE_OPTIONS,
	NecordExplorerService,
	NecordModule,
	SlashCommand,
	SlashCommandsModule,
	SlashCommandsService,
	Subcommand
} from '../../../src/index.js';

describe('SlashCommandsModule', () => {
	let client: Client;
	let slashCommandsServiceMock: { add: Mock; get: Mock };
	let slashCommandsModule: SlashCommandsModule;
	let explorerServiceMock: { explore: Mock };
	let emitInteractionCreate: (interaction: Partial<Interaction>) => void;

	beforeEach(async () => {
		client = new Client({ intents: [] });
		slashCommandsServiceMock = {
			add: vi.fn<(...args: any[]) => any>(),
			get: vi.fn<(...args: any[]) => any>()
		};
		explorerServiceMock = {
			explore: vi.fn<(...args: any[]) => any>()
		};

		const moduleRef = await Test.createTestingModule({
			imports: [NecordModule.forRoot({ intents: [], token: '' }), SlashCommandsModule]
		})
			.overrideProvider(NECORD_MODULE_OPTIONS)
			.useValue({})
			.overrideProvider(Client)
			.useValue(client)
			.overrideProvider(SlashCommandsService)
			.useValue(slashCommandsServiceMock)
			.overrideProvider(NecordExplorerService)
			.useValue(explorerServiceMock)
			.compile();

		slashCommandsModule = moduleRef.get(SlashCommandsModule);

		// simulate client.on('interactionCreate')
		emitInteractionCreate = interaction => {
			const listener = client.rawListeners('interactionCreate')[0];
			if (listener) listener(interaction);
		};
	});

	it('should add slash commands and subcommands on module init', () => {
		explorerServiceMock.explore
			.mockReturnValueOnce([{ customId: 'test' }] as any)
			.mockReturnValueOnce([]);

		slashCommandsModule.onModuleInit();

		expect(explorerServiceMock.explore).toHaveBeenCalledWith(SlashCommand.KEY);
		expect(explorerServiceMock.explore).toHaveBeenCalledWith(Subcommand.KEY);
		expect(slashCommandsServiceMock.add).toHaveBeenCalledWith({ customId: 'test' });
	});

	it('should handle chat input interaction', () => {
		slashCommandsModule.onApplicationBootstrap();

		const execute = vi.fn<(...args: any[]) => any>();
		slashCommandsServiceMock.get.mockReturnValue({ execute });

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

		expect(slashCommandsServiceMock.get).not.toHaveBeenCalled();
	});
});
