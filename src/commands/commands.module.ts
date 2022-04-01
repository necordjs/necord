import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { Client } from 'discord.js';
import { SLASH_COMMANDS, SlashCommandDiscovery, SlashCommandsModule } from './slash-commands';
import { CONTEXT_MENUS, ContextMenuDiscovery, ContextMenusModule } from './context-menus';

@Global()
@Module({
	imports: [DiscoveryModule, ContextMenusModule, SlashCommandsModule]
})
export class CommandsModule implements OnModuleInit {
	public constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly client: Client,
		@Inject(CONTEXT_MENUS)
		private readonly contextMenus: Map<string, ContextMenuDiscovery>,
		@Inject(SLASH_COMMANDS)
		private readonly slashCommands: Map<string, SlashCommandDiscovery>
	) {}

	public async onModuleInit() {
		this.client.once('ready', () => {
			this.syncCommands();
		});
	}

	private async syncCommands() {
		const commands = await this.client.application.commands.set(
			[
				...[...this.contextMenus.values()].map(contextMenu => contextMenu.toJSON()) as any,
				...[...this.slashCommands.values()].map(slashCommand => slashCommand.toJSON()) as any
			],
			'742715858157043793'
		);

		console.log(commands.toJSON());
	}

	private async syncPermissions() {}
}
