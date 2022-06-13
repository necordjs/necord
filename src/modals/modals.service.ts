import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client, InteractionType } from 'discord.js';
import { NecordExplorerService } from '../necord-explorer.service';
import { MODAL_METADATA } from '../necord.constants';
import { ModalDiscovery } from './modal.discovery';

@Injectable()
export class ModalsService implements OnModuleInit, OnApplicationBootstrap {
	private readonly modals = new Map<string, ModalDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: NecordExplorerService
	) {}

	public onModuleInit() {
		return this.explorerService
			.explore<ModalDiscovery>(MODAL_METADATA)
			.forEach(modal => this.modals.set(modal.getCustomId(), modal));
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (interaction.type !== InteractionType.ModalSubmit) return;

			return this.modals.get(interaction.customId)?.execute(interaction);
		});
	}
}
