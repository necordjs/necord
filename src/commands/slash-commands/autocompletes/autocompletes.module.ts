import { Inject, Module, OnModuleInit, Type } from '@nestjs/common';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { AutocompleteInteraction, Client } from 'discord.js';
import { AUTOCOMPLETE_METADATA } from './autocomplete.decorator';
import { AutocompleteMeta, TransformOptions } from './autocomplete.interfaces';
import { SlashCommandDiscovery } from '../slash-command.discovery';
import { SLASH_COMMANDS } from '../slash-commands.provider';
import { ModuleRef } from '@nestjs/core';

@Module({})
export class AutocompletesModule implements OnModuleInit {
	public constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly client: Client,
		@Inject(SLASH_COMMANDS)
		private readonly slashCommands: Map<string, SlashCommandDiscovery>
	) {}

	public async onModuleInit() {
		this.client.on('interactionCreate', async i => {
			if (!i.isAutocomplete()) return;

			const commandName = [
				i.commandName,
				i.options.getSubcommandGroup(false),
				i.options.getSubcommand(false)
			]
				.filter(Boolean)
				.join(' ');

			const command = this.slashCommands.get(commandName);
			const instances = command.getAutocomplete();
			const { instance: module } = command.getModule();
			// const { instance: moduleRef } = module.getProviderByKey<ModuleRef>(ModuleRef);
			//
			// if (!module || !instances || !moduleRef) return;
			//
			// const getAutocomplete = async (instance: Type): Promise<TransformOptions> => {
			// 	const provider = module.getProviderByKey(instance);
			//
			// 	if (provider) {
			// 		return provider.instance;
			// 	}
			//
			// 	module.addProvider({
			// 		provide: instance,
			// 		useValue: await moduleRef.create(instance)
			// 	});
			//
			// 	return getAutocomplete(instance);
			// };
			//
			// for (const instance of instances) {
			// 	const autocomplete = await getAutocomplete(instance);
			// 	const options = await autocomplete?.transformOptions(i, i.options.getFocused(true));
			//
			// 	if (!options || !Array.isArray(options)) continue;
			//
			// 	return i.respond(options);
			// }
			//
			// return i.respond([]);
		});
	}
}
