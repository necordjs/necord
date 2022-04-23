import { Global, Inject, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { SlashCommandDiscovery } from './slash-command.discovery';
import { Client } from 'discord.js';
import { SLASH_COMMANDS, SlashCommandsProvider } from './slash-commands.provider';
import { ExplorerService, TreeService } from '../../common';
import { AutocompletesModule } from './autocompletes';
import { SLASH_COMMAND_METADATA } from '../../necord.constants';
import {
	SlashCommandGroupDiscovery,
	SlashCommandSubGroupDiscovery
} from './slash-command-sub-group.discovery';

@Global()
@Module({
	imports: [AutocompletesModule, SlashCommandsModule],
	providers: [SlashCommandsProvider],
	exports: [SlashCommandsProvider]
})
export class SlashCommandsModule implements OnModuleInit, OnApplicationBootstrap {
	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService,
		@Inject(SLASH_COMMANDS)
		private readonly slashCommands: TreeService<SlashCommandDiscovery>
	) {}

	public async onModuleInit() {
		return this.explorerService.explore(
			SLASH_COMMAND_METADATA,
			SlashCommandDiscovery,
			command => {
				const path = [];

				if (command.getGroup()) {
					this.slashCommands.add(
						[command.getGroup().name],
						new SlashCommandGroupDiscovery({
							discoveredClass: command.discoveredMethod.parentClass,
							meta: command.getGroup()
						})
					);
				}

				if (command.getSubGroup()) {
					this.slashCommands.add(
						[command.getGroup().name, command.getSubGroup().name],
						new SlashCommandSubGroupDiscovery({
							discoveredMethod: command.discoveredMethod,
							meta: command.getSubGroup()
						})
					);
				}

				this.slashCommands.add(command.getName(), command);
			}
		);
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', i => {
			if (!i.isCommand()) return;

			const name = [
				i.commandName,
				i.options.getSubcommandGroup(false),
				i.options.getSubcommand(false)
			].filter(Boolean);

			return this.slashCommands.find(name)?.execute(i);
		});
	}
}
