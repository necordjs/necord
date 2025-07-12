import { Global, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { ContextMenusService } from './context-menus.service';
import { NecordExplorerService } from '../../necord-explorer.service';
import { ContextMenuDiscovery } from './context-menu.discovery';
import { Client } from 'discord.js';
import { ContextMenu } from './decorators';

@Global()
@Module({
	providers: [ContextMenusService],
	exports: [ContextMenusService]
})
export class ContextMenusModule implements OnModuleInit, OnApplicationBootstrap {
	public constructor(
		private readonly client: Client,
		private readonly explorerService: NecordExplorerService<ContextMenuDiscovery>,
		private readonly contextMenusService: ContextMenusService
	) {}

	public onModuleInit() {
		return this.explorerService
			.explore(ContextMenu.KEY)
			.forEach(contextMenu => this.contextMenusService.add(contextMenu));
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', interaction => {
			if (!interaction.isContextMenuCommand()) return;

			return this.contextMenusService
				.get(interaction.commandType, interaction.commandName)
				?.execute(interaction);
		});
	}
}
