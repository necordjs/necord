import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client, Collection } from 'discord.js';
import { ExplorerService } from '../necord-explorer.service';
import { MODAL_METADATA } from '../necord.constants';
import { ModalDiscovery } from './modal.discovery';

@Injectable()
export class ModalsService {
	private readonly logger = new Logger(ModalsService.name);

	public readonly cache = new Collection<string, ModalDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService<ModalDiscovery>
	) {}

	private onModuleInit() {
		return this.explorerService.explore(MODAL_METADATA).forEach(modal => this.add(modal));
	}

	private onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (!interaction.isModalSubmit()) return;

			return this.get(interaction.customId)?.execute(interaction);
		});
	}

	public add(modal: ModalDiscovery) {
		const id = modal.getCustomId();

		if (this.cache.has(id)) {
			this.logger.warn(`Modal : ${id} already exists`);
		}

		this.cache.set(id, modal);
	}

	public get(customId: string) {
		for (const modal of this.cache.values()) {
			if (modal.matcher(customId)) {
				return modal;
			}
		}

		return null;
	}

	public remove(customId: string) {
		this.cache.delete(customId);
	}
}
