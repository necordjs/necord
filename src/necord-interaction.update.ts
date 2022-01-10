import { CommandInteraction } from 'discord.js';
import { Injectable, Logger } from '@nestjs/common';
import { Context, On, Once } from './decorators';
import { NecordRegistry } from './necord-registry';
import { ContextOf, SlashCommandMetadata, TransformOptions } from './interfaces';
import { AUTOCOMPLETE_METADATA, GUILDS_METADATA, OPTIONS_METADATA } from './necord.constants';
import { ModuleRef } from '@nestjs/core';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';

@Injectable()
export class NecordInteractionUpdate {
	private readonly logger = new Logger(NecordInteractionUpdate.name);

	public constructor(private readonly registry: NecordRegistry) {}

	@Once('ready')
	private async onReady(@Context() [client]: ContextOf<'ready'>) {
		if (client.application.partial) {
			await client.application.fetch();
		}

		const commands = new Map();

		for (const command of this.registry.getApplicationCommands()) {
			const guilds = command.metadata[GUILDS_METADATA] ?? [undefined];

			for (const guild of guilds) {
				const cmds = commands.get(guild) ?? [];
				commands.set(guild, cmds.concat(command));
			}
		}

		this.logger.log(`Started refreshing application commands.`);
		await Promise.all(
			[...commands.entries()].map(([key, cmds]) => client.application.commands.set(cmds, key))
		);
		this.logger.log(`Successfully reloaded application commands.`);
	}

	@On('interactionCreate')
	private async onInteractionCreate(@Context() [interaction]: ContextOf<'interactionCreate'>) {
		if (interaction.isMessageComponent()) {
			return this.registry
				.getMessageComponent(interaction.componentType, interaction.customId)
				?.metadata.execute(
					[interaction],
					interaction.isSelectMenu() ? interaction.values : undefined
				);
		}

		if (interaction.isContextMenu()) {
			const options = interaction.isUserContextMenu()
				? {
						user: interaction.options.getUser('user', false),
						member: interaction.options.getMember('user', false)
				  }
				: { message: interaction.options.getMessage('message', false) };

			return this.registry
				.getContextMenu(interaction.targetType, interaction.commandName)
				?.metadata.execute([interaction], options);
		}

		if (interaction.isCommand() || interaction.isAutocomplete()) {
			const rootCommand = interaction.commandName;
			const groupCommand = interaction.options.getSubcommandGroup(false);
			const subCommand = interaction.options.getSubcommand(false);

			const command = this.registry.getSlashCommand(
				...[rootCommand, groupCommand, subCommand].filter(Boolean)
			);

			if (!command) return;

			if (interaction.isCommand()) {
				return command?.metadata.execute(
					[interaction],
					this.transformOptions(command, interaction)
				);
			}

			const module = command.metadata.host;
			const autocompleteMetadata = command.metadata[AUTOCOMPLETE_METADATA];
			const { instance: moduleRef } = module.getProviderByKey<ModuleRef>(ModuleRef);

			if (!module || !autocompleteMetadata || !moduleRef) return;

			const autocomplete: TransformOptions = await moduleRef
				.resolve(autocompleteMetadata, STATIC_CONTEXT, { strict: true })
				.catch(() => moduleRef.create(autocompleteMetadata));

			const options = await autocomplete?.transformOptions(
				interaction,
				interaction.options.getFocused(true)
			);

			return interaction.respond(options ?? []);
		}
	}

	private transformOptions(command: SlashCommandMetadata, interaction: CommandInteraction) {
		const rawOptions = command.metadata[OPTIONS_METADATA] ?? {};
		return Object.entries(rawOptions).reduce((acc, [parameter, option]) => {
			acc[parameter] = interaction.options[option.methodName].call(
				interaction.options,
				option.name,
				!!option.required
			);
			return acc;
		}, {});
	}
}
