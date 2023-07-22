import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client, Collection, InteractionType } from 'discord.js';
import { ExplorerService } from '../necord-explorer.service';
import { MODAL_METADATA } from '../necord.constants';
import { ModalDiscovery } from './modal.discovery';

@Injectable()
export class ModalsService implements OnModuleInit, OnApplicationBootstrap {
	private readonly logger = new Logger(ModalsService.name);

	private readonly modals = new Collection<string, ModalDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService<ModalDiscovery>
	) {}

	public onModuleInit() {
		return this.explorerService.explore(MODAL_METADATA).forEach(modal => this.add(modal));
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (interaction.type !== InteractionType.ModalSubmit) return;

			return this.get(interaction.customId)?.execute(interaction);
		});
	}

	public add(modal: ModalDiscovery) {
		const id = modal.getCustomId();

		if (this.modals.has(id)) {
			this.logger.warn(`Modal : ${id} already exists`);
		}

		this.modals.set(id, modal);
	}

	public get(customId: string) {
		for (const modal of this.modals.values()) {
			if (modal.matcher(customId)) {
				return modal;
			}
		}

		return null;
	}

	public remove(customId: string) {
		this.modals.delete(customId);
	}
}
