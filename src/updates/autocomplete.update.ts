import { Injectable } from '@nestjs/common';
import { On } from '../decorators';
import { ContextOf, TransformOptions } from '../interfaces';
import { ModuleRef } from '@nestjs/core';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { AUTOCOMPLETE_METADATA } from '../necord.constants';
import { NecordRegistry } from '../necord-registry';

@Injectable()
export class AutocompleteUpdate {
	public constructor(private readonly registry: NecordRegistry) {}

	@On('interactionCreate')
	protected async onInteractionCreate([interaction]: ContextOf<'interactionCreate'>) {
		if (!interaction.isAutocomplete()) return;

		const rootCommand = interaction.commandName;
		const groupCommand = interaction.options.getSubcommandGroup(false);
		const subCommand = interaction.options.getSubcommand(false);

		const command = this.registry.getSlashCommand(
			...[rootCommand, groupCommand, subCommand].filter(Boolean)
		);

		if (!command) return;

		const module = command.metadata.host;
		const autocompleteMetadata = command.metadata[AUTOCOMPLETE_METADATA];
		const { instance: moduleRef } = module.getProviderByKey<ModuleRef>(ModuleRef);

		if (!module || !autocompleteMetadata || !moduleRef) return;

		const autocomplete: TransformOptions = await moduleRef
			.resolve(autocompleteMetadata, STATIC_CONTEXT, { strict: true })
			.catch(() => moduleRef.create(autocompleteMetadata));

		const options = await autocomplete.transformOptions(
			interaction,
			interaction.options.getFocused(true)
		);

		return interaction.respond(options);
	}
}
