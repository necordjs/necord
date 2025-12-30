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
} from '../../src';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService } from '@nestjs/core';

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
			const exploreSpy = jest.spyOn(explorerService, 'explore');

			listenersModule.onModuleInit();

			expect(exploreSpy).toHaveBeenCalledWith(Listener.KEY);
		});

		it('should register custom handlers on application bootstrap', () => {
			const discoveryService = moduleRef.get(DiscoveryService);
			const getProvidersSpy = jest.spyOn(discoveryService, 'getProviders');

			listenersModule.onApplicationBootstrap();

			expect(getProvidersSpy).toHaveBeenCalledWith({ metadataKey: CustomListener.KEY });
		});
	});

	describe('should handle events', () => {
		const listenerDiscovery = new ListenerDiscovery({
			event: 'ready',
			type: 'once'
		});

		beforeEach(async () => {
			jest.spyOn(listenerDiscovery, 'execute').mockImplementation();
		});

		it('should handle listener events', () => {
			const explorerService = moduleRef.get(NecordExplorerService);
			jest.spyOn(explorerService, 'explore').mockReturnValue([listenerDiscovery]);

			listenersModule.onModuleInit();

			emitEvent('ready');

			expect(listenerDiscovery.execute).toHaveBeenCalled();
		});

		@CustomListener('messageCreate')
		class CustomListenerExample {
			@CustomListenerHandler()
			handleEvent(args: any[]) {
				// handle the event
			}
		}

		it('should handle custom listener events', () => {
			const discoveryService = moduleRef.get(DiscoveryService);
			const instance = new CustomListenerExample();
			const getProvidersSpy = jest.spyOn(discoveryService, 'getProviders').mockReturnValue([
				{
					instance,
					metatype: CustomListenerExample
				} as any
			]);
			const handlers = jest.spyOn(discoveryService, 'getMetadataByDecorator');
			jest.spyOn(instance, 'handleEvent');

			listenersModule.onApplicationBootstrap();

			emitEvent('messageCreate', 'test message');

			expect(getProvidersSpy).toHaveBeenCalledWith({ metadataKey: CustomListener.KEY });
			expect(handlers).toHaveBeenCalledWith(CustomListener, expect.any(Object));
			expect(handlers).toHaveLastReturnedWith('messageCreate');
			expect(instance.handleEvent).toHaveBeenCalledWith(['test message']);
		});

		it('should execute custom listeners within the async custom listener context', () => {
			const discoveryService = moduleRef.get(DiscoveryService);
			const instance = new CustomListenerExample();

			jest.spyOn(discoveryService, 'getProviders').mockReturnValue([
				{
					instance,
					metatype: CustomListenerExample
				} as any
			]);
			jest.spyOn(discoveryService, 'getMetadataByDecorator');

			jest.spyOn(instance, 'handleEvent').mockImplementation(args => {
				expect(AsyncCustomListenerContext.isAttached()).toBe(true);
				expect(AsyncCustomListenerContext.getCurrentContext().getRootEvent()).toBe(
					'messageCreate'
				);
				expect(AsyncCustomListenerContext.getCurrentContext().getRootArgs()).toEqual([
					'scoped payload'
				]);

				return args;
			});

			const runInContextSpy = jest.spyOn(AsyncCustomListenerContext, 'runInContext');

			listenersModule.onApplicationBootstrap();

			emitEvent('messageCreate', 'scoped payload');

			expect(runInContextSpy).toHaveBeenCalledWith(
				{
					root: 'messageCreate',
					args: ['scoped payload']
				},
				expect.any(Function)
			);
			expect(instance.handleEvent).toHaveBeenCalledWith(['scoped payload']);
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});
});
