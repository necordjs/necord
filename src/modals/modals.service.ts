import { Injectable, Logger } from '@nestjs/common';
import { Client, Collection } from 'discord.js';
import { ExplorerService } from '../necord-explorer.service';
import { ModalDiscovery } from './modal.discovery';
import { Modal } from './decorators';

@Injectable()
export class ModalsService {
	private readonly logger = new Logger(ModalsService.name);

	public readonly cache = new Collection<string, ModalDiscovery>();

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
