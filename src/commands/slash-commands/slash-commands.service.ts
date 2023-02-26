import { Injectable, Logger, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { SlashCommandDiscovery } from './slash-command.discovery';
import { Client, InteractionType } from 'discord.js';
import {
	SLASH_COMMAND_METADATA,
	SUBCOMMAND_GROUP_METADATA,
	SUBCOMMAND_METADATA
} from '../../necord.constants';
import { ExplorerService } from '../../necord-explorer.service';
import { CommandDiscovery } from '../command.discovery';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SlashCommandsService implements OnModuleInit, OnApplicationBootstrap {
	private readonly logger = new Logger(SlashCommandsService.name);
	private readonly slashCommands = new Map<string, SlashCommandDiscovery>();

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
			if (
				!i.isChatInputCommand() &&
				i.type !== InteractionType.ApplicationCommandAutocomplete
			)
				return;

			return this.slashCommands.get(i.commandName)?.execute(i);
		});
	}

	public getCommands(): CommandDiscovery[] {
		return [...this.slashCommands.values()];
	}

	public add(command: SlashCommandDiscovery): void {
		if (this.slashCommands.has(command.getName())) {
			this.logger.warn(`Slash Command : ${command.getName()} already exists`);
		}
		
		this.slashCommands.set(command.getName(), command);
	}

	public addSubCommand(subCommand: SlashCommandDiscovery): void {
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
			subCommandGroup.setCommand(subCommand);
			rootCommand.setCommand(subCommandGroup);
		} else {
			rootCommand.setCommand(subCommand);
		}

		if (!this.slashCommands.has(rootCommand.getName())) {
			this.slashCommands.set(rootCommand.getName(), rootCommand);
		}
	}

	public remove(commandName: string): boolean {
		return this.slashCommands.delete(commandName);
	}
}
