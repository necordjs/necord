import type { Mock } from 'vitest';

import { Client, Message } from 'discord.js';
import { Test } from '@nestjs/testing';

import {
	NECORD_MODULE_OPTIONS,
	NecordExplorerService,
	NecordModule,
	TextCommand,
	TextCommandsModule,
	TextCommandsService
} from '../../src/index.js';

describe('TextCommandsModule', () => {
	let client: Client;
	let textCommandsServiceMock: { add: Mock; get: Mock };
	let explorerServiceMock: { explore: Mock };
	let emitMessageCreate: (message: Partial<Message>) => void;

	const createModule = async (options: Record<string, unknown> = { prefix: '!' }) => {
		client = new Client({ intents: [] });
		textCommandsServiceMock = {
			add: vi.fn<(...args: any[]) => any>(),
			get: vi.fn<(...args: any[]) => any>()
		};
		explorerServiceMock = {
			explore: vi.fn<(...args: any[]) => any>().mockReturnValue([{ name: 'test' }])
		};

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
			.useValue(textCommandsServiceMock)
			.overrideProvider(NecordExplorerService)
			.useValue(explorerServiceMock)
			.compile();

		const instance = moduleRef.get(TextCommandsModule);
		await instance.onModuleInit();
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
		expect(explorerServiceMock.explore).toHaveBeenCalledWith(TextCommand.KEY);
		expect(textCommandsServiceMock.add).toHaveBeenCalledWith({ name: 'test' });
	});

	it('should handle valid command message', async () => {
		const execute = vi.fn<(...args: any[]) => any>();
		textCommandsServiceMock.get.mockReturnValue({ execute });

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

		expect(textCommandsServiceMock.get).not.toHaveBeenCalled();
	});

	it('should handle messages without prefix when allowed globally', async () => {
		await createModule({ prefix: '!', allowTextCommandsWithoutPrefix: true });

		const execute = vi.fn<(...args: any[]) => any>();
		textCommandsServiceMock.get.mockReturnValue({ execute });

		const msg = {
			content: 'hello',
			author: { bot: false }
		};

		emitMessageCreate(msg as any);
		expect(textCommandsServiceMock.get).toHaveBeenCalledWith('hello');
		expect(execute).toHaveBeenCalledWith([msg]);
	});

	it('should ignore bot messages and invalid formats', () => {
		emitMessageCreate({ content: '', author: { bot: true } } as any);
		emitMessageCreate({ content: null, author: { bot: false } } as any);
		emitMessageCreate({ content: 'hi', webhookId: '123', author: { bot: false } } as any);

		expect(textCommandsServiceMock.get).not.toHaveBeenCalled();
	});
});
