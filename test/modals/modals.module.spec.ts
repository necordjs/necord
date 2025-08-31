import { Test } from '@nestjs/testing';
import { Client, Interaction } from 'discord.js';
import {
	NECORD_MODULE_OPTIONS,
	NecordExplorerService,
	NecordModule,
	Modal,
	ModalDiscovery,
	ModalsModule,
	ModalsService
} from '../../src';

describe('ModalsModule', () => {
	let client: Client;
	let modalsService: ModalsService;
	let explorerService: NecordExplorerService<ModalDiscovery>;
	let emitInteractionCreate: (interaction: Partial<Interaction>) => void;

	beforeEach(async () => {
		client = new Client({ intents: [] });
		modalsService = { add: jest.fn(), get: jest.fn() } as any;
		explorerService = {
			explore: jest.fn().mockReturnValue([{ customId: 'test' }])
		} as any;

		const moduleRef = await Test.createTestingModule({
			imports: [NecordModule.forRoot({ intents: [], token: '' }), ModalsModule]
		})
			.overrideProvider(NECORD_MODULE_OPTIONS)
			.useValue({})
			.overrideProvider(Client)
			.useValue(client)
			.overrideProvider(ModalsService)
			.useValue(modalsService)
			.overrideProvider(NecordExplorerService)
			.useValue(explorerService)
			.compile();

		const instance = moduleRef.get(ModalsModule);
		instance.onModuleInit();
		instance.onApplicationBootstrap();

		// simulate client.on('interactionCreate')
		emitInteractionCreate = interaction => {
			const listener = client.rawListeners('interactionCreate')[0];
			if (listener) listener(interaction);
		};
	});

	it('should add modals on module init', () => {
		expect(explorerService.explore).toHaveBeenCalledWith(Modal.KEY);
		expect(modalsService.add).toHaveBeenCalledWith({ customId: 'test' });
	});

	it('should handle modal submit interaction', () => {
		const execute = jest.fn();
		(modalsService.get as jest.Mock).mockReturnValue({ execute });

		const interaction = {
			isModalSubmit: () => true,
			customId: 'test'
		};

		emitInteractionCreate(interaction as any);
		expect(execute).toHaveBeenCalledWith(interaction);
	});

	it('should ignore non-modal interactions', () => {
		emitInteractionCreate({ isModalSubmit: () => false } as any);
		expect(modalsService.get).not.toHaveBeenCalled();
	});
});
