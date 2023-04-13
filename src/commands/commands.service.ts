import { Inject, Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { NECORD_MODULE_OPTIONS } from '../necord.constants';
import { Client } from 'discord.js';
import { NecordModuleOptions } from '../necord-options.interface';
import { ContextMenusService } from './context-menus';
import { CommandDiscovery } from './command.discovery';
import { SlashCommandsService } from './slash-commands';

@Injectable()
export class CommandsService implements OnModuleInit, OnApplicationBootstrap {
	private readonly logger = new Logger(CommandsService.name);

	private readonly applicationCommands = new Map<string, CommandDiscovery[]>([[undefined, []]]);

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

		return this.client.once('ready', async client => this.register());
	}

	public onApplicationBootstrap() {
		const commands = [
			...this.contextMenusService.getCommands(),
			...this.slashCommandsService.getCommands()
		];

		for (const command of commands) {
			const guilds = Array.isArray(this.options.development)
				? this.options.development
				: command.getGuilds() ?? [undefined];

			for (const guildId of guilds) {
				const visitedCommands = this.applicationCommands.get(guildId) ?? [];
				this.applicationCommands.set(guildId, visitedCommands.concat(command));
			}
		}
	}

	public async register() {
		if (this.client.application.partial) {
			await this.client.application.fetch();
		}

		this.logger.log(`Started refreshing application commands.`);
		for (const guild of this.applicationCommands.keys()) {
			await this.registerInGuild(guild);
		}
		this.logger.log(`Successfully reloaded application commands.`);
	}

	public async registerInGuild(guildId: string) {
		return this.client.application.commands.set(
			this.getGuildCommands(guildId).flatMap(command => command.toJSON())
		);
	}

	public getCommands(): CommandDiscovery[] {
		return [...this.applicationCommands.values()].flat();
	}

	public getCommandByName(name: string): CommandDiscovery {
		return this.getCommands().find(command => command.getName() === name);
	}

	public getGlobalCommands(): CommandDiscovery[] {
		return this.applicationCommands.get(undefined) ?? [];
	}

	public getGuildCommands(guildId: string): CommandDiscovery[] {
		return this.applicationCommands.get(guildId) ?? [];
	}

	public getGlobalCommandByName(name: string): CommandDiscovery {
		return this.getGlobalCommands().find(command => command.getName() === name);
	}

	public getGuildCommandByName(guildId: string, name: string): CommandDiscovery {
		return this.getGuildCommands(guildId).find(command => command.getName() === name);
	}
}
