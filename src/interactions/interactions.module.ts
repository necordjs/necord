import { Global, Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { CONTEXT_MENUS, ContextMenusModule } from './context-menus';
import { SLASH_COMMANDS, SlashCommandsModule } from './slash-commands';
import { Node, TreeService } from '../common';
import { Client } from 'discord.js';
import { NECORD_MODULE_OPTIONS, NecordModuleOptions } from '../necord.options';
import { InteractionDiscovery } from './interaction.discovery';

@Global()
@Module({
	imports: [ContextMenusModule, SlashCommandsModule]
})
export class InteractionsModule implements OnModuleInit {
	private readonly logger = new Logger(InteractionsModule.name);

	public constructor(
		private readonly client: Client,
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
		@Inject(CONTEXT_MENUS)
		private readonly contextMenus: TreeService<InteractionDiscovery>,
		@Inject(SLASH_COMMANDS)
		private readonly slashCommands: TreeService<InteractionDiscovery>
	) {}

	public onModuleInit() {
		return this.client.once('ready', async client => {
			if (client.application.partial) {
				await client.application.fetch();
			}

			const clientCommands = client.application.commands;
			const nodes = [this.contextMenus.getRoot(), this.slashCommands.getRoot()].flatMap(
				root => root.children
			);

			console.log(nodes);

			const commandsByGuildMap = new Map<string, Array<Node<InteractionDiscovery>>>([
				[undefined, []]
			]);

			for (const node of nodes) {
				const command = node.value;
				const defaultGuild = Array.isArray(this.options.development)
					? this.options.development
					: [undefined];

				for (const guild of command.getGuilds() ?? defaultGuild) {
					const visitedCommands = commandsByGuildMap.get(guild) ?? [];
					commandsByGuildMap.set(guild, visitedCommands.concat(node));
				}
			}

			this.logger.log(`Started refreshing application commands.`);
			for (const [guild, commands] of [...commandsByGuildMap.entries()]) {
				await clientCommands.set(
					commands.flatMap(command => command.toJSON()),
					guild
				);
			}
			this.logger.log(`Successfully reloaded application commands.`);
		});
	}
}
