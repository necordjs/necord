import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService } from '@nestjs/core';
import { Client } from 'discord.js';

import {
	AsyncCustomListenerContext,
	CustomListener,
	CustomListenerHandler,
	Listener,
	ListenerDiscovery,
	ListenersModule,
	NecordExplorerService,
	NecordModule
} from '../../src/index.js';

describe('ListenersModule', () => {
	let client: Client;
	let moduleRef: TestingModule;
	let listenersModule: ListenersModule;
	let emitEvent: (event: string, ...args: any[]) => void;

	beforeEach(async () => {
		client = new Client({ intents: [] });

		moduleRef = await Test.createTestingModule({
			imports: [NecordModule.forRoot({ intents: [], token: '' }), ListenersModule]
		})
			.overrideProvider(Client)
			.useValue(client)
			.compile();

		listenersModule = moduleRef.get(ListenersModule);

		emitEvent = (event, ...args) => {
			const listeners = client.rawListeners(event);

			for (const listener of listeners) {
				listener(...args);
			}
		};
	});

	describe('should register handlers on startup', () => {
		it('should register listeners on module init', () => {
			const explorerService = moduleRef.get(NecordExplorerService);
			const exploreSpy = vi.spyOn(explorerService, 'explore');

			listenersModule.onModuleInit();

			expect(exploreSpy).toHaveBeenCalledWith(Listener.KEY);
		});

		it('should register custom handlers on application bootstrap', () => {
			const discoveryService = moduleRef.get(DiscoveryService);
			const getProvidersSpy = vi.spyOn(discoveryService, 'getProviders');

			listenersModule.onApplicationBootstrap();

			expect(getProvidersSpy).toHaveBeenCalledWith({ metadataKey: CustomListener.KEY });
		});
	});

	describe('should handle events', () => {
		const listenerDiscovery = new ListenerDiscovery({
			event: 'ready',
			type: 'once'
		});

		it('should handle listener events', () => {
			const executeSpy = vi
				.spyOn(listenerDiscovery, 'execute')
				.mockImplementation(() => undefined);
			const explorerService = moduleRef.get(NecordExplorerService);
			vi.spyOn(explorerService, 'explore').mockReturnValue([listenerDiscovery]);

			listenersModule.onModuleInit();

			emitEvent('ready');

			expect(executeSpy).toHaveBeenCalled();
		});

		@CustomListener('messageCreate')
		class CustomListenerExample {
			@CustomListenerHandler()
			handleEvent(_args: any[]) {
				// handle the event
			}
		}

		it('should handle custom listener events', () => {
			const discoveryService = moduleRef.get(DiscoveryService);
			const instance = new CustomListenerExample();
			const getProvidersSpy = vi.spyOn(discoveryService, 'getProviders').mockReturnValue([
				{
					instance,
					metatype: CustomListenerExample
				} as any
			]);
			const handlers = vi.spyOn(discoveryService, 'getMetadataByDecorator');
			const handleEventSpy = vi.spyOn(instance, 'handleEvent');

			listenersModule.onApplicationBootstrap();

			emitEvent('messageCreate', 'test message');

			expect(getProvidersSpy).toHaveBeenCalledWith({ metadataKey: CustomListener.KEY });
			expect(handlers).toHaveBeenCalledWith(CustomListener, expect.any(Object));
			expect(handlers).toHaveLastReturnedWith('messageCreate');
			expect(handleEventSpy).toHaveBeenCalledWith(['test message']);
		});

		it('should execute custom listeners within the async custom listener context', () => {
			const discoveryService = moduleRef.get(DiscoveryService);
			const instance = new CustomListenerExample();

			vi.spyOn(discoveryService, 'getProviders').mockReturnValue([
				{
					instance,
					metatype: CustomListenerExample
				} as any
			]);
			vi.spyOn(discoveryService, 'getMetadataByDecorator');

			const handleEventSpy = vi.spyOn(instance, 'handleEvent').mockImplementation(args => {
				expect(AsyncCustomListenerContext.isAttached()).toBe(true);
				expect(AsyncCustomListenerContext.getCurrentContext().getRootEvent()).toBe(
					'messageCreate'
				);
				expect(AsyncCustomListenerContext.getCurrentContext().getRootArgs()).toEqual([
					'scoped payload'
				]);

				return args;
			});

			const runInContextSpy = vi.spyOn(AsyncCustomListenerContext, 'runInContext');

			listenersModule.onApplicationBootstrap();

			emitEvent('messageCreate', 'scoped payload');

			expect(runInContextSpy).toHaveBeenCalledWith(
				{
					root: 'messageCreate',
					args: ['scoped payload']
				},
				expect.any(Function)
			);
			expect(handleEventSpy).toHaveBeenCalledWith(['scoped payload']);
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});
});
