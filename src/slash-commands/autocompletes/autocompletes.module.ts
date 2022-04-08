import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { Client } from 'discord.js';
import { SlashCommandDiscovery } from '../slash-command.discovery';
import { SLASH_COMMANDS } from '../slash-commands.provider';
import { TreeService } from '../../common';
import { ModuleRef } from '@nestjs/core';

@Global()
@Module({})
export class AutocompletesModule implements OnModuleInit {
	public constructor(
		private readonly client: Client,
		@Inject(SLASH_COMMANDS)
		private readonly slashCommands: TreeService<SlashCommandDiscovery>,
		private readonly moduleRef: ModuleRef
	) {}

	public async onModuleInit() {
		this.client.on('interactionCreate', async i => {
			if (!i.isAutocomplete()) return;

			const commandName = [
				i.commandName,
				i.options.getSubcommandGroup(false),
				i.options.getSubcommand(false)
			].filter(Boolean);

			const command = this.slashCommands.find(commandName);

			if (!command) return;

			for (const instance of command.getAutocomplete() ?? []) {
				const autocomplete = this.moduleRef.get(instance, { strict: false });
				const options = await autocomplete?.transformOptions(i, i.options.getFocused(true));

				if (!options || !Array.isArray(options)) continue;

				return i.respond(options);
			}

			return i.respond([]);
		});
	}
}
