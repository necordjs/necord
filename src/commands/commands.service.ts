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

	public async register() {
		if (this.client.application.partial) {
			await this.client.application.fetch();
		}

		this.logger.log(`Started refreshing application commands.`);
		for (const [guild, commands] of this.getCommandsByGuilds().entries()) {
			if (commands.length === 0) {
				this.logger.log(
					`Skipping ${guild ? `guild ${guild}` : 'global'} as it has no commands.`
				);
				continue;
			}

			const rawCommands = commands.flatMap(command => command.toJSON());

			await this.client.application.commands.set(rawCommands, guild).catch(error => {
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
