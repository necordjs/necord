import { Inject, Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import {
	SlashCommandDiscovery,
	SlashCommandGroupDiscovery,
	SlashCommandSubGroupDiscovery
} from './slash-command.discovery';
import { Client } from 'discord.js';
import { SLASH_COMMAND_METADATA, SLASH_COMMANDS, SLASH_GROUP_METADATA } from '../necord.constants';
import { TreeService } from '../tree.service';
import { NecordExplorerService } from '../necord-explorer.service';

@Injectable()
export class SlashCommandsService implements OnModuleInit, OnApplicationBootstrap {
	public constructor(
		private readonly client: Client,
		private readonly explorerService: NecordExplorerService,
		@Inject(SLASH_COMMANDS)
		private readonly slashCommands: TreeService<SlashCommandDiscovery>
	) {}

	public async onModuleInit() {
		return this.explorerService.explore(
			SLASH_COMMAND_METADATA,
			SlashCommandDiscovery,
			command => {
				const [groupMeta, subGroupMeta] = this.explorerService.getAll(
					SLASH_GROUP_METADATA,
					[command.getClass(), command.getHandler()]
				);

				const commandPath = [groupMeta, subGroupMeta, command.meta]
					.map(x => x?.name)
					.filter(Boolean)
					.map(c => c.toLowerCase());

				this.slashCommands.add(commandPath, command);

				if (!groupMeta) return;

				this.slashCommands.add(
					commandPath.slice(0, 1),
					new SlashCommandGroupDiscovery({
						discoveredClass: command.discoveredMethod.parentClass,
						meta: groupMeta
					})
				);

				if (!subGroupMeta) return;

				this.slashCommands.add(
					commandPath.slice(0, 2),
					new SlashCommandSubGroupDiscovery({
						discoveredMethod: command.discoveredMethod,
						meta: subGroupMeta
					})
				);
			}
		);
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', i => {
			if (!i.isChatInputCommand() && !i.isAutocomplete()) return;

			const name = [
				i.commandName,
				i.options.getSubcommandGroup(false),
				i.options.getSubcommand(false)
			].filter(Boolean);

			return this.slashCommands.find(name)?.execute(i);
		});
	}
}
