import { Collection } from 'discord.js';
import { Injectable, Logger } from '@nestjs/common';
import { ContextMenuDiscovery, ContextMenuMeta } from './context-menu.discovery';

@Injectable()
export class ContextMenusService {
	private readonly logger = new Logger(ContextMenusService.name);

	public readonly cache = new Collection<string, ContextMenuDiscovery>();

	public add(contextMenu: ContextMenuDiscovery): void {
		const id = this.getId(contextMenu.getType(), contextMenu.getName());

		if (this.cache.has(id)) {
			this.logger.warn(`ContextMenu with id : ${id} is already exists`);
		}

		this.cache.set(id, contextMenu);
	}

	public get(type: ContextMenuMeta['type'], name: ContextMenuMeta['name']): ContextMenuDiscovery {
		return this.cache.get(this.getId(type, name));
	}

	public remove(type: ContextMenuMeta['type'], name: ContextMenuMeta['name']): boolean {
		return this.cache.delete(this.getId(type, name));
	}

	private getId(type: ContextMenuMeta['type'], name: string) {
		return type.toString().concat(':', name);
	}
}
