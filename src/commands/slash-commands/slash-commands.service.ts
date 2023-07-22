import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { SlashCommandDiscovery } from './slash-command.discovery';
import { Client, Collection } from 'discord.js';
import {
	SLASH_COMMAND_METADATA,
	SUBCOMMAND_GROUP_METADATA,
	SUBCOMMAND_METADATA
} from '../../necord.constants';
import { ExplorerService } from '../../necord-explorer.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SlashCommandsService implements OnModuleInit, OnApplicationBootstrap {
	private readonly logger = new Logger(SlashCommandsService.name);

	private readonly slashCommands = new Collection<string, SlashCommandDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService<SlashCommandDiscovery>,
		private readonly reflector: Reflector
	) {}

	public async onModuleInit() {
		this.explorerService.explore(SLASH_COMMAND_METADATA).forEach(command => this.add(command));

		return this.explorerService
			.explore(SUBCOMMAND_METADATA)
			.forEach(subcommand => this.addSubCommand(subcommand));
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', i => {
			if (!i.isChatInputCommand() && !i.isAutocomplete()) return;

			return this.get(i.commandName)?.execute(i);
		});
	}

	public getCommands(): SlashCommandDiscovery[] {
		return [...this.slashCommands.values()];
	}

	public add(command: SlashCommandDiscovery): void {
		if (this.slashCommands.has(command.getName())) {
			this.logger.warn(`Slash Command : ${command.getName()} already exists`);
		}

		this.slashCommands.set(command.getName(), command);
	}

	public get(commandName: string): SlashCommandDiscovery {
		return this.slashCommands.get(commandName);
	}

	public remove(commandName: string): boolean {
		return this.slashCommands.delete(commandName);
	}

	private addSubCommand(subCommand: SlashCommandDiscovery): void {
		const rootCommand = this.reflector.get<SlashCommandDiscovery>(
			SLASH_COMMAND_METADATA,
			subCommand.getClass()
		);
		const subCommandGroup = this.reflector.get<SlashCommandDiscovery>(
			SUBCOMMAND_GROUP_METADATA,
			subCommand.getClass()
		);

		if (!rootCommand) {
			throw new ReferenceError(
				`can't register subcommand "${subCommand.getName()}" w/o root command`
			);
		}

		if (subCommandGroup) {
			subCommandGroup.setSubcommand(subCommand);
			rootCommand.setSubcommand(subCommandGroup);
		} else {
			rootCommand.setSubcommand(subCommand);
		}

		if (!this.slashCommands.has(rootCommand.getName())) {
			this.slashCommands.set(rootCommand.getName(), rootCommand);
		}
	}
}
