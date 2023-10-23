import { Global, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { ListenersService } from './listeners.service';
import { Listener } from './decorators';
import { Client } from 'discord.js';
import { ExplorerService } from '../necord-explorer.service';
import { ListenerDiscovery } from './listener.discovery';

@Global()
@Module({
	providers: [ListenersService],
	exports: [ListenersService]
})
export class ListenersModule implements OnModuleInit, OnApplicationBootstrap {
	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService<ListenerDiscovery>
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
		// TODO: Move here custom listeners
	}
}
