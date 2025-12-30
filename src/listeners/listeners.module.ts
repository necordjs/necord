import { Global, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { CustomListener, CustomListenerHandler, Listener } from './decorators';
import { Client } from 'discord.js';
import { NecordExplorerService } from '../necord-explorer.service';
import { ListenerDiscovery } from './listener.discovery';
import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import * as CustomListeners from './handlers';
import { AsyncLocalStorage } from 'node:async_hooks';
import { AsyncCustomListenerContext } from './scopes';

const { BaseHandler, ...listeners } = CustomListeners;

@Global()
@Module({
	imports: [DiscoveryModule],
	providers: Object.values(listeners)
})
export class ListenersModule implements OnModuleInit, OnApplicationBootstrap {
	public constructor(
		private readonly client: Client,
		private readonly explorerService: NecordExplorerService<ListenerDiscovery>,
		private readonly discoveryService: DiscoveryService,
		private readonly metadataScanner: MetadataScanner,
		private readonly reflector: Reflector
	) {}

	public onModuleInit() {
		return this.explorerService
			.explore(Listener.KEY)
			.forEach(listener =>
				this.client[listener.getType()](listener.getEvent(), (...args) =>
					listener.execute(args)
				)
			);
	}

	public onApplicationBootstrap(): any {
		const wrappers = this.discoveryService.getProviders({
			metadataKey: CustomListener.KEY
		});

		for (const wrapper of wrappers) {
			const customListener = this.discoveryService.getMetadataByDecorator(
				CustomListener,
				wrapper
			);

			const instance = wrapper.instance;
			const prototype = Object.getPrototypeOf(instance);
			const methods = this.metadataScanner
				.getAllMethodNames(prototype)
				.filter(method => this.reflector.get(CustomListenerHandler, prototype[method]));

			this.client.on(customListener, (...args) => {
				for (const method of methods) {
					AsyncCustomListenerContext.runInContext(customListener, () => {
						return instance[method](args);
					});
				}
			});
		}
	}
}
