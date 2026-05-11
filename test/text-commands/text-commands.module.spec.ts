import { Client, Message } from 'discord.js';
import { Test } from '@nestjs/testing';

import {
	NECORD_MODULE_OPTIONS,
	NecordExplorerService,
	NecordModule,
	TextCommand,
	TextCommandDiscovery,
	TextCommandsModule,
	TextCommandsService
} from '../../src';

describe('TextCommandsModule', () => {
	let client: Client;
	let textCommandsService: TextCommandsService;
	let explorerService: NecordExplorerService<TextCommandDiscovery>;
	let emitMessageCreate: (message: Partial<Message>) => void;

	const createModule = async (options: Record<string, unknown> = { prefix: '!' }) => {
		client = new Client({ intents: [] });
		textCommandsService = { add: jest.fn(), get: jest.fn() } as any;
		explorerService = {
			explore: jest.fn().mockReturnValue([{ name: 'test' }])
		} as any;

		const moduleRef = await Test.createTestingModule({
			imports: [
				NecordModule.forRoot({ prefix: '!', intents: [], token: '' }),
				TextCommandsModule
			]
		})
			.overrideProvider(NECORD_MODULE_OPTIONS)
			.useValue(options)
			.overrideProvider(Client)
			.useValue(client)
			.overrideProvider(TextCommandsService)
			.useValue(textCommandsService)
			.overrideProvider(NecordExplorerService)
			.useValue(explorerService)
			.compile();

		const instance = moduleRef.get(TextCommandsModule);
		instance.onModuleInit();
		instance.onApplicationBootstrap();

		// simulate client.on('messageCreate')
		emitMessageCreate = message => {
			const listener = client.rawListeners('messageCreate')[0];
			if (listener) listener(message);
		};
	};

	beforeEach(async () => {
		await createModule();
	});

	it('should add commands on module init', () => {
		expect(explorerService.explore).toHaveBeenCalledWith(TextCommand.KEY);
		expect(textCommandsService.add).toHaveBeenCalledWith({ name: 'test' });
	});

	it('should handle valid command message', async () => {
		const execute = jest.fn();
		(textCommandsService.get as jest.Mock).mockReturnValue({ execute });

		const msg = {
			content: '!hello',
			webhookId: null,
			author: { bot: false }
		};

		emitMessageCreate(msg as any);
		expect(execute).toHaveBeenCalledWith([msg]);
	});

	it('should ignore messages without prefix by default', () => {
		emitMessageCreate({ content: 'hello', author: { bot: false } } as any);

		expect(textCommandsService.get).not.toHaveBeenCalled();
	});

	it('should handle messages without prefix when allowed globally', async () => {
		await createModule({ prefix: '!', allowTextCommandsWithoutPrefix: true });

		const execute = jest.fn();
		(textCommandsService.get as jest.Mock).mockReturnValue({ execute });

		const msg = {
			content: 'hello',
			author: { bot: false }
		};

		emitMessageCreate(msg as any);
		expect(textCommandsService.get).toHaveBeenCalledWith('hello');
		expect(execute).toHaveBeenCalledWith([msg]);
	});

	it('should ignore bot messages and invalid formats', () => {
		emitMessageCreate({ content: '', author: { bot: true } } as any);
		emitMessageCreate({ content: null, author: { bot: false } } as any);
		emitMessageCreate({ content: 'hi', webhookId: '123', author: { bot: false } } as any);

		expect(textCommandsService.get).not.toHaveBeenCalled();
	});
});
