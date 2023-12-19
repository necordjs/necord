import { Injectable, Logger } from '@nestjs/common';
import { Client, Collection } from 'discord.js';
import { CommandDiscovery } from './command.discovery';
import { ContextMenusService } from './context-menus';
import { SlashCommandsService } from './slash-commands';

@Injectable()
export class CommandsService {
	private readonly logger = new Logger(CommandsService.name);

	public constructor(
		private readonly client: Client,
		private readonly contextMenusService: ContextMenusService,
		private readonly slashCommandsService: SlashCommandsService
	) {}

	public async registerAllCommands() {
		const guilds = new Set(this.getCommandsByGuilds().keys());

		this.logger.log(`Started refreshing application commands.`);
		for (const guild of guilds) {
			await this.registerInGuild(guild);
		}
		this.logger.log(`Successfully reloaded application commands.`);
	}

	public async registerInGuild(guildId: string) {
		const commands = this.getGuildCommands(guildId);

		if (commands.length === 0) {
			this.logger.log(
				`Skipping ${guildId ? `guild ${guildId}` : 'global'} as it has no commands.`
			);
			return;
		}

		const rawCommands = commands.flatMap(command => command.toJSON());

		return this.client.application.commands.set(rawCommands, guildId).catch(error => {
			this.logger.error(
				`Failed to register application commands (${
					guildId ? `in guild ${guildId}` : 'global'
				}): ${error}`,
				error.stack
			);
		});
	}

	public getCommands(): CommandDiscovery[] {
		return [
			...this.contextMenusService.cache.values(),
			...this.slashCommandsService.cache.values()
		].flat();
	}

	public getCommandsByGuilds(): Collection<string, CommandDiscovery[]> {
		const collection = new Collection<string, CommandDiscovery[]>();
		const commands = this.getCommands();

		for (const command of commands) {
			for (const guildId of command.getGuilds()) {
				const visitedCommands = collection.get(guildId) ?? [];
				collection.set(guildId, visitedCommands.concat(command));
			}
		}

		return collection;
	}

	public getCommandByName(name: string): CommandDiscovery {
		return this.getCommands().find(command => command.getName() === name);
	}

	public getGlobalCommands(): CommandDiscovery[] {
		return this.getCommandsByGuilds().get(undefined) ?? [];
	}

	public getGlobalCommandByName(name: string): CommandDiscovery {
		return this.getGlobalCommands().find(command => command.getName() === name);
	}

	public getGuildCommands(guildId: string): CommandDiscovery[] {
		return this.getCommandsByGuilds().get(guildId) ?? [];
	}

	public getGuildCommandByName(guildId: string, name: string): CommandDiscovery {
		return this.getGuildCommands(guildId).find(command => command.getName() === name);
	}
}
