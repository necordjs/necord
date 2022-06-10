import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { ContextMenuDiscovery } from './context-menu.discovery';
import { Client } from 'discord.js';
import { CONTEXT_MENU_METADATA } from '../../necord.constants';
import { NecordExplorerService } from '../../necord-explorer.service';
import { CommandDiscovery } from '../command.discovery';

@Injectable()
export class ContextMenusService implements OnModuleInit, OnApplicationBootstrap {
	private readonly contextMenus = new Map<string, ContextMenuDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: NecordExplorerService
	) {}

	public onModuleInit() {
		return this.explorerService.exploreMethods<ContextMenuDiscovery>(
			CONTEXT_MENU_METADATA,
			contextMenu =>
				this.contextMenus.set(
					contextMenu.getContextType().toString().concat(':', contextMenu.getName()),
					contextMenu
				)
		);
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
}
