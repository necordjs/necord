import { Inject, Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { ContextMenuDiscovery } from './context-menu.discovery';
import { Client } from 'discord.js';
import { CONTEXT_MENU_METADATA, CONTEXT_MENUS } from '../necord.constants';
import { TreeService } from '../tree.service';
import { NecordExplorerService } from '../necord-explorer.service';

@Injectable()
export class ContextMenusService implements OnModuleInit, OnApplicationBootstrap {
	public constructor(
		private readonly client: Client,
		private readonly explorerService: NecordExplorerService,
		@Inject(CONTEXT_MENUS)
		private readonly contextMenus: TreeService<ContextMenuDiscovery>
	) {}

	public onModuleInit() {
		return this.explorerService.explore(
			CONTEXT_MENU_METADATA,
			ContextMenuDiscovery,
			contextMenu => {
				this.contextMenus.add(
					[contextMenu.getContextType().toString().concat(':', contextMenu.getName())],
					contextMenu
				);
			}
		);
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (!interaction.isContextMenuCommand()) return;

			return this.contextMenus
				.find([interaction.commandType.toString().concat(':', interaction.commandName)])
				?.execute(interaction);
		});
	}
}
