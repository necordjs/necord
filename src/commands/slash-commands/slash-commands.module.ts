import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { SlashCommandDiscovery, SlashCommandMeta } from './slash-command.discovery';
import { SLASH_COMMAND_METADATA } from '../commands.constants';
import { Client } from 'discord.js';
import { SLASH_COMMANDS, SlashCommandsProvider } from './slash-commands.provider';

@Global()
@Module({
	imports: [DiscoveryModule, SlashCommandsModule],
	providers: [SlashCommandsProvider],
	exports: [SlashCommandsProvider]
})
export class SlashCommandsModule implements OnModuleInit {
	public constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly client: Client,
		@Inject(SLASH_COMMANDS)
		private readonly slashCommands: Map<string, SlashCommandDiscovery>
	) {}

	public async onModuleInit() {
		await this.discoveryService
			.providerMethodsWithMetaAtKey<SlashCommandMeta>(SLASH_COMMAND_METADATA)
			.then(methods => methods.map(m => new SlashCommandDiscovery(m)))
			.then(discovered => discovered.forEach(d => this.slashCommands.set(d.getName(), d)));

		this.client.on('interactionCreate', i => {
			if (!i.isCommand()) return;

			const commandName = [
				i.commandName,
				i.options.getSubcommandGroup(false),
				i.options.getSubcommand(false)
			]
				.filter(Boolean)
				.join(' ');

			return this.slashCommands.get(commandName)?.execute(i);
		});
	}
}
