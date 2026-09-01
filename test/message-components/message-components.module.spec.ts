import type { Mock } from 'vitest';

import { Client, Interaction } from 'discord.js';
import { Test } from '@nestjs/testing';

import {
	MessageComponent,
	MessageComponentDiscovery,
	MessageComponentsModule,
	MessageComponentsService,
	NECORD_MODULE_OPTIONS,
	NecordExplorerService,
	NecordModule
} from '../../src/index.js';

describe('MessageComponentsModule', () => {
	let client: Client;
	let componentsServiceMock: { add: Mock; get: Mock };
	let explorerServiceMock: { explore: Mock };
	let emitInteractionCreate: (interaction: Partial<Interaction>) => void;

	beforeEach(async () => {
		client = new Client({ intents: [] });
		componentsServiceMock = {
			add: vi.fn<(component: MessageComponentDiscovery) => void>(),
			get: vi.fn<MessageComponentsService['get']>()
		};
		explorerServiceMock = {
			explore: vi
				.fn<() => Array<{ customId: string }>>()
				.mockReturnValue([{ customId: 'test' }])
		};

		const moduleRef = await Test.createTestingModule({
			imports: [NecordModule.forRoot({ intents: [], token: '' }), MessageComponentsModule]
		})
			.overrideProvider(NECORD_MODULE_OPTIONS)
			.useValue({})
			.overrideProvider(Client)
			.useValue(client)
			.overrideProvider(MessageComponentsService)
			.useValue(componentsServiceMock)
			.overrideProvider(NecordExplorerService)
			.useValue(explorerServiceMock)
			.compile();

		const instance = moduleRef.get(MessageComponentsModule);
		instance.onModuleInit();
		instance.onApplicationBootstrap();

		// simulate client.on('interactionCreate')
		emitInteractionCreate = interaction => {
			const listener = client.rawListeners('interactionCreate')[0];
			if (listener) listener(interaction);
		};
	});

	it('should add components on module init', () => {
		expect(explorerServiceMock.explore).toHaveBeenCalledWith(MessageComponent.KEY);
		expect(componentsServiceMock.add).toHaveBeenCalledWith({ customId: 'test' });
	});

	it('should handle message component interaction', () => {
		const execute = vi.fn<(interaction: unknown) => void>();
		componentsServiceMock.get.mockReturnValue({ execute });

		const interaction = {
			isMessageComponent: () => true,
			customId: 'test'
		};

		emitInteractionCreate(interaction as any);
		expect(execute).toHaveBeenCalledWith(interaction);
	});

	it('should ignore non-message component interactions', () => {
		emitInteractionCreate({ isMessageComponent: () => false } as any);
		expect(componentsServiceMock.get).not.toHaveBeenCalled();
	});
});
