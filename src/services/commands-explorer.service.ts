import { Injectable } from '@nestjs/common';
import { BaseExplorerService } from './base-explorer.service';
import { ApplicationCommandMetadata, OptionMetadata } from '../interfaces';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { MetadataAccessorService } from './metadata-accessor.service';
import { NecordClient } from '../necord-client';
import {
	ApplicationCommandData,
	ApplicationCommandSubCommandData,
	ApplicationCommandSubGroupData,
	ChatInputApplicationCommandData
} from 'discord.js';
import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';

type TransformFn = (name: string, required: boolean) => any;

@Injectable()
export class CommandsExplorerService extends BaseExplorerService<ApplicationCommandMetadata> {
	public constructor(
		protected readonly externalContextCreator: ExternalContextCreator,
		protected readonly discoveryService: DiscoveryService,
		private readonly metadataScanner: MetadataScanner,
		private readonly metadataAccessor: MetadataAccessorService,
		private readonly client: NecordClient
	) {
		super(externalContextCreator, discoveryService);
	}

	protected filter(instance: Record<string, any>, prototype: object): ApplicationCommandMetadata[] {
		return this.metadataScanner.scanFromPrototype(instance, prototype, method => {
			const command = this.metadataAccessor.getApplicationCommandMetadata(instance, method);

			if (!command) return;

			return {
				...command,
				instance,
				prototype,
				method
			};
		});
	}

	protected register(applicationCommands: ApplicationCommandMetadata[]): void {
		for (const { instance, prototype, method, ...command } of applicationCommands) {
			const options = this.metadataAccessor.getOptionsMetadata(instance, method);
			const execute = this.createContextCallback(instance, prototype, method);
			let group = this.metadataAccessor.getCommandGroupMetadata(instance, method);
			let subGroup = this.metadataAccessor.getCommandSubGroupMetadata(instance, method);

			if (command.type !== ApplicationCommandTypes.CHAT_INPUT) {
				this.client.applicationCommands.push(command);
				this.registerContextMenuHandler(command as any, execute);
				continue;
			} else if (!group && subGroup) {
				subGroup = undefined;
			}

			command.options = Object.values(options);
			this.registerSlashCommandHandler(group?.name, subGroup?.name, command as any, options, execute);

			if (!group && !subGroup) {
				this.client.applicationCommands.push(command);
				continue;
			}

			const cachedGroup = this.client.applicationCommands.find(
				c => c.type === ApplicationCommandTypes.CHAT_INPUT && c.name === group.name
			) as ChatInputApplicationCommandData;
			group = cachedGroup ?? group;

			if (!subGroup) {
				group.options.push(command as unknown as ApplicationCommandSubCommandData);
				continue;
			} else {
				const cachedSubGroup = group.options.find(
					s => s.type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP && s.name === subGroup?.name
				) as ApplicationCommandSubGroupData;
				subGroup = cachedSubGroup ?? subGroup;
				subGroup.options.push(command as unknown as ApplicationCommandSubCommandData);
				!cachedSubGroup && group.options.push(subGroup);
			}

			!cachedGroup && this.client.applicationCommands.push(group);
		}
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
				CommandsExplorerService.getCommandKey(rootCommand, groupCommand, subCommandGroup) !==
				CommandsExplorerService.getCommandKey(group, subGroup, command.name)
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
