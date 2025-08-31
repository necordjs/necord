import { Test } from '@nestjs/testing';
import { Client, Interaction } from 'discord.js';
import {
	MessageComponent,
	MessageComponentDiscovery,
	MessageComponentsModule,
	MessageComponentsService,
	NECORD_MODULE_OPTIONS,
	NecordExplorerService,
	NecordModule
} from '../../src';

describe('MessageComponentsModule', () => {
	let client: Client;
	let componentsService: MessageComponentsService;
	let explorerService: NecordExplorerService<MessageComponentDiscovery>;
	let emitInteractionCreate: (interaction: Partial<Interaction>) => void;

	beforeEach(async () => {
		client = new Client({ intents: [] });
		componentsService = { add: jest.fn(), get: jest.fn() } as any;
		explorerService = {
			explore: jest.fn().mockReturnValue([{ customId: 'test' }])
		} as any;

		const moduleRef = await Test.createTestingModule({
			imports: [NecordModule.forRoot({ intents: [], token: '' }), MessageComponentsModule]
		})
			.overrideProvider(NECORD_MODULE_OPTIONS)
			.useValue({})
			.overrideProvider(Client)
			.useValue(client)
			.overrideProvider(MessageComponentsService)
			.useValue(componentsService)
			.overrideProvider(NecordExplorerService)
			.useValue(explorerService)
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
		expect(explorerService.explore).toHaveBeenCalledWith(MessageComponent.KEY);
		expect(componentsService.add).toHaveBeenCalledWith({ customId: 'test' });
	});

	it('should handle message component interaction', () => {
		const execute = jest.fn();
		(componentsService.get as jest.Mock).mockReturnValue({ execute });

		const interaction = {
			isMessageComponent: () => true,
			customId: 'test'
		};

		emitInteractionCreate(interaction as any);
		expect(execute).toHaveBeenCalledWith(interaction);
	});

	it('should ignore non-message component interactions', () => {
		emitInteractionCreate({ isMessageComponent: () => false } as any);
		expect(componentsService.get).not.toHaveBeenCalled();
	});
});
