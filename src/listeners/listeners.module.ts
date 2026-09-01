import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { Global, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client } from 'discord.js';

import { AsyncCustomListenerContext, AsyncCustomListenerContextOptions } from './scopes/index.js';
import { CustomListener, CustomListenerHandler, Listener } from './decorators/index.js';
import { NecordExplorerService } from '../necord-explorer.service.js';
import { ListenerDiscovery } from './listener.discovery.js';
import * as CustomListeners from './handlers/index.js';

const { BaseHandler: _, ...LISTENERS } = CustomListeners;

@Global()
@Module({
	imports: [DiscoveryModule],
	providers: Object.values(LISTENERS)
})
export class ListenersModule implements OnApplicationBootstrap, OnModuleInit {
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

			if (!customListener || !instance) {
				continue;
			}

			const prototype = Object.getPrototypeOf(instance);
			const methods = this.metadataScanner
				.getAllMethodNames(prototype)
				.filter(method => this.reflector.get(CustomListenerHandler, prototype[method]));

			this.client.on(customListener, (...args) => {
				const context: AsyncCustomListenerContextOptions = {
					root: customListener,
					args: args
				};

				for (const method of methods) {
					AsyncCustomListenerContext.runInContext(
						context,
						instance[method].bind(instance, args)
					);
				}
			});
		}
	}
}
