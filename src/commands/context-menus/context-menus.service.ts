import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { ContextMenuDiscovery, ContextMenuMeta } from './context-menu.discovery';
import { Client } from 'discord.js';
import { CONTEXT_MENU_METADATA } from '../../necord.constants';
import { ExplorerService } from '../../necord-explorer.service';
import { CommandDiscovery } from '../command.discovery';

@Injectable()
export class ContextMenusService implements OnModuleInit, OnApplicationBootstrap {
	private readonly contextMenus = new Map<string, ContextMenuDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService<ContextMenuDiscovery>
	) {}

	public onModuleInit() {
		return this.explorerService
			.explore(CONTEXT_MENU_METADATA)
			.forEach(contextMenu => this.setCommand(contextMenu));
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (!interaction.isContextMenuCommand()) return;

			return this.contextMenus
				.get(interaction.commandType.toString().concat(':', interaction.commandName))
				?.execute(interaction);
		});
	}

	public getCommands(): CommandDiscovery[] {
		return [...this.contextMenus.values()];
	}

	public addCommands(...contextMenus: ContextMenuDiscovery[]): void {
		contextMenus.forEach(contextMenu => this.setCommand(contextMenu));
	}

	public removeCommands(
		...contextMenus: Array<Pick<ContextMenuMeta, 'type' | 'name'>>
	): boolean[] {
		return contextMenus.map(contextMenu => {
			return this.contextMenus.delete(
				contextMenu.type.toString().concat(':', contextMenu.name)
			);
		});
	}

	private setCommand(contextMenu: ContextMenuDiscovery) {
		return this.contextMenus.set(
			contextMenu.getType().toString().concat(':', contextMenu.getName()),
			contextMenu
		);
	}
}
