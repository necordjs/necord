import { CommandInteraction } from 'discord.js';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Context, On, Once } from './decorators';
import { NecordRegistry } from './necord-registry';
import {
	ApplicationCommandMetadata,
	ContextOf,
	NecordModuleOptions,
	OptionMetadata,
	SlashCommandMetadata,
	TransformOptions
} from './interfaces';
import {
	AUTOCOMPLETE_METADATA,
	GUILDS_METADATA,
	NECORD_MODULE_OPTIONS,
	OPTIONS_METADATA,
	PERMISSIONS_METADATA
} from './necord.constants';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class NecordInteractionUpdate {
	private readonly logger = new Logger(NecordInteractionUpdate.name);

	public constructor(
		private readonly registry: NecordRegistry,
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions
	) {}

	@Once('ready')
	private async onReady(@Context() [client]: ContextOf<'ready'>) {
		if (client.application.partial) {
			await client.application.fetch();
		}

		const clientCommands = client.application.commands;
		const commandsByGuildMap = new Map<string, ApplicationCommandMetadata[]>([[undefined, []]]);

		for (const command of this.registry.getApplicationCommands()) {
			const guilds = command.metadata[GUILDS_METADATA] ?? [].concat(this.options.development);

			for (const guild of guilds) {
				const visitedCommands = commandsByGuildMap.get(guild) ?? [];
				commandsByGuildMap.set(guild, visitedCommands.concat(command));
			}
		}

		this.logger.log(`Started refreshing application commands.`);
		for (const [guild, commands] of commandsByGuildMap.entries()) {
			const registeredCommands = await clientCommands.set(commands, guild);

			const fullPermissions = commands.map(command => {
				const applicationCommand = registeredCommands.find(x => x.name === command.name);

				return {
					id: applicationCommand.id,
					permissions: command.metadata[PERMISSIONS_METADATA]
				};
			});

			if (guild) {
				await clientCommands.permissions.set({
					guild,
					fullPermissions
				});

				continue;
			}

			for (const perm of fullPermissions) {
				await clientCommands.permissions.set({
					guild,
					command: perm.id,
					permissions: perm.permissions
				});
			}
		}
		this.logger.log(`Successfully reloaded application commands.`);
	}

	@On('interactionCreate')
	private async onInteractionCreate(@Context() [interaction]: ContextOf<'interactionCreate'>) {
		if (interaction.isMessageComponent()) {
			return this.registry
				.getMessageComponent(interaction.componentType, interaction.customId)
				?.metadata.execute(
					[interaction],
					interaction.isSelectMenu() ? interaction.values : undefined,
					{ type: 'messageComponent' }
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
				?.metadata.execute([interaction], options, {
					type: 'contextMenu'
				});
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
				return command.metadata.execute(
					[interaction],
					this.transformOptions(command, interaction),
					{ type: 'slashCommands' }
				);
			}

			const module = command.metadata.host;
			const autocompleteMetadata = command.metadata[AUTOCOMPLETE_METADATA];
			const { instance: moduleRef } = module.getProviderByKey<ModuleRef>(ModuleRef);

			if (!module || !autocompleteMetadata || !moduleRef) return;

			const getAutocomplete = async (): Promise<TransformOptions> => {
				const provider = module.getProviderByKey(autocompleteMetadata);

				if (provider) {
					return provider.instance;
				}

				module.addProvider({
					provide: autocompleteMetadata,
					useValue: await moduleRef.create(autocompleteMetadata)
				});

				return getAutocomplete();
			};

			let autocomplete: TransformOptions = await getAutocomplete();

			const options = await autocomplete.transformOptions(
				interaction,
				interaction.options.getFocused(true)
			);

			return interaction.respond(options ?? []);
		}
	}

	private transformOptions(command: SlashCommandMetadata, interaction: CommandInteraction) {
		const rawOptions: Record<string, OptionMetadata> = command.metadata[OPTIONS_METADATA] ?? {};

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
