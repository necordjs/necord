import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NECORD_MODULE_OPTIONS } from '../necord.constants';
import { Client } from 'discord.js';
import { NecordModuleOptions } from '../necord-options.interface';
import { ContextMenusService } from './context-menus';
import { CommandDiscovery } from './command.discovery';
import { SlashCommandsService } from './slash-commands';

@Injectable()
export class CommandsService implements OnModuleInit {
	private readonly logger = new Logger(CommandsService.name);

	public constructor(
		private readonly client: Client,
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
		private readonly contextMenusService: ContextMenusService,
		private readonly slashCommandsService: SlashCommandsService
	) {}

	public onModuleInit() {
		if (this.options.skipRegistration) {
			return;
		}

		return this.client.once('ready', async client => this.register(client));
	}

	public async register(client: Client) {
		if (client.application.partial) {
			await client.application.fetch();
		}

		const clientCommands = client.application.commands;
		const commands = [
			...this.contextMenusService.getCommands(),
			...this.slashCommandsService.getCommands()
		];

		const commandsByGuildMap = new Map<string, Array<CommandDiscovery>>([[undefined, []]]);

		for (const command of commands) {
			const guilds = Array.isArray(this.options.development)
				? this.options.development
				: command.getGuilds() ?? [undefined];

			for (const guildId of guilds) {
				const visitedCommands = commandsByGuildMap.get(guildId) ?? [];
				commandsByGuildMap.set(guildId, visitedCommands.concat(command));
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
	}
}
