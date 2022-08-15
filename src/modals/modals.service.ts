import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client, InteractionType } from 'discord.js';
import { ExplorerService } from '../necord-explorer.service';
import { MODAL_METADATA } from '../necord.constants';
import { ModalDiscovery } from './modal.discovery';

@Injectable()
export class ModalsService implements OnModuleInit, OnApplicationBootstrap {
	private readonly modals: ModalDiscovery[] = [];

	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService<ModalDiscovery>
	) {}

	public onModuleInit() {
		return this.explorerService
			.explore(MODAL_METADATA)
			.forEach(modal => this.modals.push(modal));
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (interaction.type !== InteractionType.ModalSubmit) return;

			const name = interaction.customId;

			for (const modal of this.modals) {
				if (modal.matcher(name)) {
					return modal.execute(interaction);
				}
			}
		});
	}
}
