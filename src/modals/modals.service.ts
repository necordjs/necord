import { Injectable, Logger } from '@nestjs/common';
import { Collection } from 'discord.js';
import { ModalDiscovery } from './modal.discovery';

/**
 * Service that manages modals.
 */
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
	}

	public remove(customId: string) {
		this.cache.delete(customId);
	}
}
