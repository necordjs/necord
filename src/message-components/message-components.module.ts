import { Global, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client } from 'discord.js';

import { MessageComponentDiscovery } from './message-component.discovery.js';
import { MessageComponentsService } from './message-components.service.js';
import { NecordExplorerService } from '../necord-explorer.service.js';
import { MessageComponent } from './decorators/index.js';

@Global()
@Module({
	providers: [MessageComponentsService],
	exports: [MessageComponentsService]
})
export class MessageComponentsModule implements OnApplicationBootstrap, OnModuleInit {
	public constructor(
		private readonly client: Client,
		private readonly explorerService: NecordExplorerService<MessageComponentDiscovery>,
		private readonly messageComponentsService: MessageComponentsService
	) {}

	public onModuleInit() {
		return this.explorerService
			.explore(MessageComponent.KEY)
			.forEach(component => this.messageComponentsService.add(component));
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (!interaction.isMessageComponent()) return;

			return this.messageComponentsService
				.get(interaction.componentType, interaction.customId)
				?.execute(interaction);
		});
	}
}
