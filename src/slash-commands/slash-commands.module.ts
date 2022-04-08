import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { SlashCommandDiscovery, SlashCommandMeta } from './slash-command.discovery';
import { Client } from 'discord.js';
import { SLASH_COMMANDS, SlashCommandsProvider } from './slash-commands.provider';
import { TreeService } from '../common';
import { SLASH_COMMAND_METADATA } from './slash-commands.constants';
import { AutocompletesModule } from './autocompletes';

@Global()
@Module({
	imports: [DiscoveryModule, AutocompletesModule, SlashCommandsModule],
	providers: [SlashCommandsProvider],
	exports: [SlashCommandsProvider]
})
export class SlashCommandsModule implements OnModuleInit {
	public constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly client: Client,
		@Inject(SLASH_COMMANDS)
		private readonly slashCommands: TreeService<SlashCommandDiscovery>
	) {}

	public async onModuleInit() {
		await this.discoveryService
			.providerMethodsWithMetaAtKey<SlashCommandMeta>(SLASH_COMMAND_METADATA)
			.then(methods => methods.map(m => new SlashCommandDiscovery(m)))
			.then(discovered =>
				discovered.forEach(d => {
					if (d.getGroup()) {
						this.slashCommands.add([d.getGroup().name], d.getGroup());
					}

					if (d.getSubGroup()) {
						this.slashCommands.add(
							[d.getGroup().name, d.getSubGroup().name],
							d.getSubGroup()
						);
					}

					this.slashCommands.add(d.getName().split(' '), d);
				})
			);

		this.client.on('interactionCreate', i => {
			if (!i.isCommand()) return;

			return this.slashCommands
				.find(
					[
						i.commandName,
						i.options.getSubcommandGroup(false),
						i.options.getSubcommand(false)
					].filter(Boolean)
				)
				?.execute(i);
		});
	}
}
