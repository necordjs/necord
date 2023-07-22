import { Client, Collection } from 'discord.js';
import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { ContextMenuDiscovery, ContextMenuMeta } from './context-menu.discovery';
import { CONTEXT_MENU_METADATA } from '../../necord.constants';
import { ExplorerService } from '../../necord-explorer.service';

@Injectable()
export class ContextMenusService implements OnModuleInit, OnApplicationBootstrap {
	private readonly logger = new Logger(ContextMenusService.name);

	public readonly cache = new Collection<string, ContextMenuDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService<ContextMenuDiscovery>
	) {}

	public onModuleInit() {
		return this.explorerService
			.explore(CONTEXT_MENU_METADATA)
			.forEach(contextMenu => this.add(contextMenu));
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (!interaction.isContextMenuCommand()) return;

			return this.get(interaction.commandType, interaction.commandName)?.execute(interaction);
		});
	}

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
