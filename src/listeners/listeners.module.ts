import { Module, OnModuleInit } from '@nestjs/common';
import { ListenerDiscovery } from './listener.discovery';
import { Client } from 'discord.js';
import { ListenersUpdate } from './listeners.update';
import { LISTENERS_METADATA } from '../necord.constants';
import { ExplorerService } from '../common';

@Module({
	providers: [ListenersUpdate]
})
export class ListenersModule implements OnModuleInit {
	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService
	) {}

	public async onModuleInit() {
		return this.explorerService.explore(LISTENERS_METADATA, ListenerDiscovery, listener =>
			this.client[listener.getListenerType()](listener.getEvent(), (...args) =>
				listener.execute(args)
			)
		);
	}
}
