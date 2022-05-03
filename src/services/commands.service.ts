import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CONTEXT_MENUS, SLASH_COMMANDS } from '../necord.constants';
import { Client } from 'discord.js';
import { CommandDiscovery } from '../discovery';
import { Node, TreeService } from './tree.service';
import { NECORD_MODULE_OPTIONS } from '../necord.constants';
import { NecordModuleOptions } from '../interfaces';

@Injectable()
export class CommandsService implements OnModuleInit {
	private readonly logger = new Logger(CommandsService.name);

	public constructor(
		private readonly client: Client,
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
		@Inject(CONTEXT_MENUS)
		private readonly contextMenus: TreeService<CommandDiscovery>,
		@Inject(SLASH_COMMANDS)
		private readonly slashCommands: TreeService<CommandDiscovery>
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

			const commandsByGuildMap = new Map<string, Array<Node<CommandDiscovery>>>([
				[undefined, []]
			]);

			for (const node of nodes) {
				const commandGuilds = node.value.getGuilds();
				const defaultGuild = Array.isArray(this.options.development)
					? this.options.development
					: [undefined];

				for (const guild of commandGuilds.size ? commandGuilds : defaultGuild) {
					const visitedCommands = commandsByGuildMap.get(guild) ?? [];
					commandsByGuildMap.set(guild, visitedCommands.concat(node));
				}
			}

			this.logger.log(`Started refreshing application commands.`);
			for (const [guild, commands] of commandsByGuildMap) {
				await clientCommands.set(
					commands.flatMap(command => command.toJSON()),
					guild
				);
			}
			this.logger.log(`Successfully reloaded application commands.`);
		});
	}
}
