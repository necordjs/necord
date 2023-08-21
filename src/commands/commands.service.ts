import { Inject, Injectable, Logger } from '@nestjs/common';
import { NECORD_MODULE_OPTIONS } from '../necord.module-definition';
import { Client, Collection } from 'discord.js';
import { NecordModuleOptions } from '../necord-options.interface';
import { ContextMenusService } from './context-menus';
import { CommandDiscovery } from './command.discovery';
import { SlashCommandsService } from './slash-commands';

@Injectable()
export class CommandsService {
	private readonly logger = new Logger(CommandsService.name);

	public readonly cache = new Collection<string, CommandDiscovery[]>([[undefined, []]]);

	public constructor(
		private readonly client: Client,
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
		private readonly contextMenusService: ContextMenusService,
		private readonly slashCommandsService: SlashCommandsService
	) {}

	private onModuleInit() {
		if (this.options.skipRegistration) {
			return;
		}

		return this.client.once('ready', async () => this.register());
	}

	private onApplicationBootstrap() {
		const commands: CommandDiscovery[] = [
			...this.contextMenusService.cache.values(),
			...this.slashCommandsService.cache.values()
		];

		for (const command of commands) {
			const guilds = Array.isArray(this.options.development)
				? this.options.development
				: command.getGuilds() ?? [undefined];

			for (const guildId of guilds) {
				const visitedCommands = this.cache.get(guildId) ?? [];
				this.cache.set(guildId, visitedCommands.concat(command));
			}
		}
	}

	public async register() {
		if (this.client.application.partial) {
			await this.client.application.fetch();
		}

		this.logger.log(`Started refreshing application commands.`);
		for (const guild of this.cache.keys()) {
			if (this.getGuildCommands(guild).length === 0) {
				this.logger.log(
					`Skipping ${guild ? `guild ${guild}` : 'global'} as it has no commands.`
				);
				continue;
			}

			await this.registerInGuild(guild).catch(error => {
				this.logger.error(
					`Failed to register application commands (${
						guild ? `in guild ${guild}` : 'global'
					}): ${error}`,
					error.stack
				);
			});
		}
		this.logger.log(`Successfully reloaded application commands.`);
	}

	public async registerInGuild(guildId: string) {
		return this.client.application.commands.set(
			this.getGuildCommands(guildId).flatMap(command => command.toJSON()),
			guildId
		);
	}

	public getCommands(): CommandDiscovery[] {
		return [...this.cache.values()].flat();
	}

	public getCommandByName(name: string): CommandDiscovery {
		return this.getCommands().find(command => command.getName() === name);
	}

	public getGlobalCommands(): CommandDiscovery[] {
		return this.cache.get(undefined) ?? [];
	}

	public getGlobalCommandByName(name: string): CommandDiscovery {
		return this.getGlobalCommands().find(command => command.getName() === name);
	}

	public getGuildCommands(guildId: string): CommandDiscovery[] {
		return this.cache.get(guildId) ?? [];
	}

	public getGuildCommandByName(guildId: string, name: string): CommandDiscovery {
		return this.getGuildCommands(guildId).find(command => command.getName() === name);
	}
}
