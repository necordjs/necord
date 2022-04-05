import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { Client } from 'discord.js';
import { SLASH_COMMANDS, SlashCommandDiscovery, SlashCommandsModule } from './slash-commands';
import { CONTEXT_MENUS, ContextMenuDiscovery, ContextMenusModule } from './context-menus';
import { TreeService } from '../common';
import { TextCommandsModule } from './text-commands';

@Global()
@Module({
	imports: [DiscoveryModule, ContextMenusModule, SlashCommandsModule, TextCommandsModule]
})
export class CommandsModule implements OnModuleInit {
	public constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly client: Client,
		@Inject(CONTEXT_MENUS)
		private readonly contextMenus: TreeService<ContextMenuDiscovery>,
		@Inject(SLASH_COMMANDS)
		private readonly slashCommands: TreeService<SlashCommandDiscovery>
	) {}

	public async onModuleInit() {
		return this.client.once('ready', () => {
			this.syncCommands();
		});
	}

	private async syncCommands() {
		const commands = await this.client.application.commands.set(
			[...this.contextMenus.toJSON(), ...this.slashCommands.toJSON()],
			'742715858157043793'
		);
	}

	private async syncPermissions() {}
}
