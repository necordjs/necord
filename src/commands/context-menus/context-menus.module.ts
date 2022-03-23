import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { CONTEXT_MENUS, ContextMenusProvider } from './context-menus.provider';
import { ContextMenuDiscovery, ContextMenuMeta } from './context-menu.discovery';
import { CONTEXT_MENU_METADATA } from '../commands.constants';
import { Client } from 'discord.js';

@Module({
	imports: [DiscoveryModule],
	providers: [ContextMenusProvider],
	exports: [ContextMenusProvider]
})
export class ContextMenusModule implements OnModuleInit {
	public constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly client: Client,
		@Inject(CONTEXT_MENUS)
		private readonly contextMenus: Map<string, ContextMenuDiscovery>
	) {}

	public async onModuleInit() {
		await this.discoveryService
			.providerMethodsWithMetaAtKey<ContextMenuMeta>(CONTEXT_MENU_METADATA)
			.then(methods => methods.map(m => new ContextMenuDiscovery(m)))
			.then(discovered => discovered.forEach(d => this.contextMenus.set(d.getKey(), d)));

		return this.client.on('interactionCreate', interaction => {
			if (!interaction.isContextMenu()) return;

			return this.contextMenus
				.get([interaction.targetType, interaction.commandName].join(':'))
				?.execute(interaction);
		});
	}
}
