import { CommandInteraction } from 'discord.js';
import { Inject, Injectable, Logger, Type } from '@nestjs/common';
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
	OPTIONS_METADATA
} from './necord.constants';
import { ModuleRef } from '@nestjs/core';
import { NecordInfoType } from './context';

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
			const defaultGuild = Array.isArray(this.options.development)
				? this.options.development
				: [undefined];

			for (const guild of command.metadata[GUILDS_METADATA] ?? defaultGuild) {
				const visitedCommands = commandsByGuildMap.get(guild) ?? [];
				commandsByGuildMap.set(guild, visitedCommands.concat(command));
			}
		}

		this.logger.log(`Started refreshing application commands.`);
		await Promise.all(
			[...commandsByGuildMap.entries()].map(([guild, commands]) =>
				clientCommands.set(commands, guild)
			)
		);
		this.logger.log(`Successfully reloaded application commands.`);
	}

	@On('interactionCreate')
	private async onInteractionCreate(@Context() [interaction]: ContextOf<'interactionCreate'>) {
		if (interaction.isModalSubmit()) {
			return this.registry
				.getModal(interaction.customId)
				?.metadata.execute([interaction], null, { type: NecordInfoType.MODAL });
		}

		if (interaction.isMessageComponent()) {
			return this.registry
				.getMessageComponent(interaction.componentType, interaction.customId)
				?.metadata.execute(
					[interaction],
					interaction.isSelectMenu() ? interaction.values : undefined,
					{ type: NecordInfoType.MESSAGE_COMPONENT }
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
					type: NecordInfoType.CONTEXT_MENU
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
					{ type: NecordInfoType.SLASH_COMMANDS }
				);
			}

			const module = command.metadata.host;
			const instances = command.metadata[AUTOCOMPLETE_METADATA];
			const { instance: moduleRef } = module.getProviderByKey<ModuleRef>(ModuleRef);

			if (!module || !instances || !moduleRef) return;

			const getAutocomplete = async (instance: Type): Promise<TransformOptions> => {
				const provider = module.getProviderByKey(instance);

				if (provider) {
					return provider.instance;
				}

				module.addProvider({
					provide: instance,
					useValue: await moduleRef.create(instance)
				});

				return getAutocomplete(instance);
			};

			for (const instance of instances) {
				const autocomplete = await getAutocomplete(instance);
				const options = await autocomplete?.transformOptions(
					interaction,
					interaction.options.getFocused(true)
				);

				if (!options || !Array.isArray(options)) continue;

				return interaction.respond(options);
			}

			return interaction.respond([]);
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
