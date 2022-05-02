import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client } from 'discord.js';
import { ExplorerService } from './explorer.service';
import { MODAL_METADATA } from '../necord.constants';
import { ModalDiscovery } from '../discovery';

@Injectable()
export class ModalsService implements OnModuleInit, OnApplicationBootstrap {
	private readonly modals = new Map<string, ModalDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService
	) {}

	public onModuleInit() {
		return this.explorerService.explore(MODAL_METADATA, ModalDiscovery, discovery =>
			this.modals.set(discovery.getCustomId(), discovery)
		);
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (!interaction.isModalSubmit()) return;

			return this.modals.get(interaction.customId)?.execute(interaction);
		});
	}
}
