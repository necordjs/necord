import { Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { ListenerDiscovery, ListenerMeta } from './listener.discovery';
import { Client } from 'discord.js';
import { LISTENERS_METADATA } from './listeners.constants';

@Module({
	imports: [DiscoveryModule]
})
export class ListenersModule implements OnModuleInit {
	public constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly client: Client
	) {}

	public onModuleInit() {
		return this.discoveryService
			.providerMethodsWithMetaAtKey<ListenerMeta>(LISTENERS_METADATA)
			.then(methods => methods.map(m => new ListenerDiscovery(m)))
			.then(listeners =>
				listeners.forEach(listener =>
					this.client[listener.meta.type](listener.meta.event, (...args) =>
						listener.execute(args)
					)
				)
			);
	}
}
