import { Test } from '@nestjs/testing';
import { Client, Interaction } from 'discord.js';
import {
	ContextMenu,
	ContextMenuDiscovery,
	ContextMenusModule,
	ContextMenusService,
	NECORD_MODULE_OPTIONS,
	NecordExplorerService,
	NecordModule
} from '../../../src';

describe('ContextMenusModule', () => {
	let client: Client;
	let contextMenusService: ContextMenusService;
	let explorerService: NecordExplorerService<ContextMenuDiscovery>;
	let emitInteractionCreate: (interaction: Partial<Interaction>) => void;

	beforeEach(async () => {
		client = new Client({ intents: [] });
		contextMenusService = { add: jest.fn(), get: jest.fn() } as any;
		explorerService = {
			explore: jest.fn().mockReturnValue([{ customId: 'test' }])
		} as any;

		const moduleRef = await Test.createTestingModule({
			imports: [NecordModule.forRoot({ intents: [], token: '' }), ContextMenusModule]
		})
			.overrideProvider(NECORD_MODULE_OPTIONS)
			.useValue({})
			.overrideProvider(Client)
			.useValue(client)
			.overrideProvider(ContextMenusService)
			.useValue(contextMenusService)
			.overrideProvider(NecordExplorerService)
			.useValue(explorerService)
			.compile();

		const instance = moduleRef.get(ContextMenusModule);
		instance.onModuleInit();
		instance.onApplicationBootstrap();

		// simulate client.on('interactionCreate')
		emitInteractionCreate = interaction => {
			const listener = client.rawListeners('interactionCreate')[0];
			if (listener) listener(interaction);
		};
	});

	it('should add context menus on module init', () => {
		expect(explorerService.explore).toHaveBeenCalledWith(ContextMenu.KEY);
		expect(contextMenusService.add).toHaveBeenCalledWith({ customId: 'test' });
	});

	it('should handle context menu interaction', () => {
		const execute = jest.fn();
		(contextMenusService.get as jest.Mock).mockReturnValue({ execute });

		const interaction = {
			isContextMenuCommand: () => true,
			customId: 'test'
		};

		emitInteractionCreate(interaction as any);
		expect(execute).toHaveBeenCalledWith(interaction);
	});

	it('should ignore non-context menu interactions', () => {
		emitInteractionCreate({ isContextMenuCommand: () => false } as any);
		expect(contextMenusService.get).not.toHaveBeenCalled();
	});
});
