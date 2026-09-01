import { Global, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client } from 'discord.js';

import { NecordExplorerService } from '../necord-explorer.service.js';
import { ModalDiscovery } from './modal.discovery.js';
import { ModalsService } from './modals.service.js';
import { Modal } from './decorators/index.js';

@Global()
@Module({
	providers: [ModalsService],
	exports: [ModalsService]
})
export class ModalsModule implements OnApplicationBootstrap, OnModuleInit {
	public constructor(
		private readonly client: Client,
		private readonly explorerService: NecordExplorerService<ModalDiscovery>,
		private readonly modalsService: ModalsService
	) {}

	public onModuleInit() {
		return this.explorerService
			.explore(Modal.KEY)
			.forEach(modal => this.modalsService.add(modal));
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (!interaction.isModalSubmit()) return;

			return this.modalsService.get(interaction.customId)?.execute(interaction);
		});
	}
}
