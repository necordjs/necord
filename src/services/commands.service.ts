import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ExplorerService } from './explorer.service';
import { ApplicationCommandMetadata, OptionMetadata } from '../interfaces';
import { MetadataAccessorService } from './metadata-accessor.service';
import { NecordClient } from '../necord-client';
import {
	ApplicationCommandData,
	ApplicationCommandSubCommandData,
	ApplicationCommandSubGroupData,
	ChatInputApplicationCommandData
} from 'discord.js';
import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';
import { On } from '../decorators';

type TransformFn = (name: string, required: boolean) => any;

@Injectable()
export class CommandsService implements OnModuleInit {
	private readonly logger = new Logger(NecordClient.name);

	private readonly commands: ApplicationCommandData[] = [];

	public constructor(
		private readonly explorerService: ExplorerService<ApplicationCommandMetadata>,
		private readonly metadataAccessor: MetadataAccessorService,
		private readonly client: NecordClient
	) {}

	public onModuleInit() {
		const commands = this.explorerService.explore((instance, prototype, method) => {
			const command = this.metadataAccessor.getApplicationCommandMetadata(instance, method);

			if (!command) return;

			return {
				...command,
				instance,
				prototype,
				method
			};
		});

		for (const { instance, prototype, method, ...command } of commands) {
			const options = this.metadataAccessor.getOptionsMetadata(instance, method);
			let group = this.metadataAccessor.getCommandGroupMetadata(instance, method);
			let subGroup = this.metadataAccessor.getCommandSubGroupMetadata(instance, method);

			if (command.type !== ApplicationCommandTypes.CHAT_INPUT) {
				this.commands.push(command);
				this.registerContextMenuHandler(command as any, command.execute);
				return;
			} else if (!group && subGroup) {
				subGroup = undefined;
			}

			command.options = Object.values(options);
			this.registerSlashCommandHandler(group?.name, subGroup?.name, command as any, options, command.execute);

			if (!group && !subGroup) {
				this.commands.push(command);
				return;
			}

			const cachedGroup = this.commands.find(
				c => c.type === ApplicationCommandTypes.CHAT_INPUT && c.name === group.name
			) as ChatInputApplicationCommandData;
			group = cachedGroup ?? group;

			if (!subGroup) {
				group.options.push(command as unknown as ApplicationCommandSubCommandData);
				return;
			} else {
				const cachedSubGroup = group.options.find(
					s => s.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP && s.name === subGroup?.name
				) as ApplicationCommandSubGroupData;
				subGroup = cachedSubGroup ?? subGroup;
				subGroup.options.push(command as unknown as ApplicationCommandSubCommandData);
				!cachedSubGroup && group.options.push(subGroup);
			}

			!cachedGroup && this.commands.push(group);
		}
	}

	@On('ready')
	private async onReadyRegistration() {
		if (!this.client.options.registerApplicationCommands) {
			return;
		}

		if (this.client.application.partial) {
			await this.client.application.fetch();
		}

		this.logger.log(`Started refreshing application commands.`);
		await this.client.application.commands.set(
			this.commands,
			typeof this.client.options.registerApplicationCommands === 'string'
				? this.client.options.registerApplicationCommands
				: undefined
		);
		this.logger.log(`Successfully reloaded application commands.`);
	}

	private registerContextMenuHandler(
		command: Exclude<ApplicationCommandData, ChatInputApplicationCommandData>,
		execute: (...args) => void
	) {
		this.client.on(
			'interactionCreate',
			interaction =>
				interaction.isContextMenu() &&
				interaction.targetType === command.type &&
				interaction.commandName === command.name &&
				execute(
					interaction,
					interaction.targetType === 'USER'
						? {
								user: interaction.options.getUser('user'),
								member: interaction.options.getMember('user')
						  }
						: { message: interaction.options.getMessage('message') }
				)
		);
	}

	private registerSlashCommandHandler(
		group: string,
		subGroup: string,
		command: ChatInputApplicationCommandData,
		options: Record<string, OptionMetadata>,
		execute: (...args) => void
	) {
		this.client.on('interactionCreate', async interaction => {
			if (!interaction.isCommand()) return;

			const rootCommand = interaction.commandName;
			const groupCommand = interaction.options.getSubcommandGroup(false);
			const subCommandGroup = interaction.options.getSubcommand(false);

			if (
				CommandsService.getCommandKey(rootCommand, groupCommand, subCommandGroup) !==
				CommandsService.getCommandKey(group, subGroup, command.name)
			)
				return;

			const DTO = Object.entries(options).reduce((prev, [parameter, option]) => {
				const resolve = interaction.options[option.methodName] as TransformFn;
				prev[parameter] = resolve.call(interaction.options, option.name, !!option.required);

				return prev;
			}, {});

			return execute(interaction, DTO);
		});
	}

	private static getCommandKey(group: string, subGroup: string, command: string) {
		let commandKey: string;

		if (!!group) {
			if (!!subGroup) {
				commandKey = `${group}-${subGroup}-${command}`;
			} else {
				commandKey = `${group}-null-${command}`;
			}
		} else {
			commandKey = `${command}-null-null`;
		}

		return commandKey;
	}
}
