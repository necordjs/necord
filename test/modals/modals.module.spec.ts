import type { Mock } from 'vitest';

import { Client, Interaction } from 'discord.js';
import { Test } from '@nestjs/testing';

import {
	NECORD_MODULE_OPTIONS,
	NecordExplorerService,
	NecordModule,
	Modal,
	ModalDiscovery,
	ModalsModule,
	ModalsService
} from '../../src/index.js';

describe('ModalsModule', () => {
	let client: Client;
	let modalsServiceMock: { add: Mock; get: Mock };
	let explorerServiceMock: { explore: Mock };
	let emitInteractionCreate: (interaction: Partial<Interaction>) => void;

	beforeEach(async () => {
		client = new Client({ intents: [] });
		modalsServiceMock = {
			add: vi.fn<(modal: ModalDiscovery) => void>(),
			get: vi.fn<ModalsService['get']>()
		};
		explorerServiceMock = {
			explore: vi
				.fn<() => Array<{ customId: string }>>()
				.mockReturnValue([{ customId: 'test' }])
		};

		const moduleRef = await Test.createTestingModule({
			imports: [NecordModule.forRoot({ intents: [], token: '' }), ModalsModule]
		})
			.overrideProvider(NECORD_MODULE_OPTIONS)
			.useValue({})
			.overrideProvider(Client)
			.useValue(client)
			.overrideProvider(ModalsService)
			.useValue(modalsServiceMock)
			.overrideProvider(NecordExplorerService)
			.useValue(explorerServiceMock)
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
		expect(explorerServiceMock.explore).toHaveBeenCalledWith(Modal.KEY);
		expect(modalsServiceMock.add).toHaveBeenCalledWith({ customId: 'test' });
	});

	it('should handle modal submit interaction', () => {
		const execute = vi.fn<(interaction: unknown) => void>();
		modalsServiceMock.get.mockReturnValue({ execute });

		const interaction = {
			isModalSubmit: () => true,
			customId: 'test'
		};

		emitInteractionCreate(interaction as any);
		expect(execute).toHaveBeenCalledWith(interaction);
	});

	it('should ignore non-modal interactions', () => {
		emitInteractionCreate({ isModalSubmit: () => false } as any);
		expect(modalsServiceMock.get).not.toHaveBeenCalled();
	});
});
