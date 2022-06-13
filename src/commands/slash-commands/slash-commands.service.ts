import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
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
	private readonly slashCommands = new Map<string, SlashCommandDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService<SlashCommandDiscovery>,
		private readonly reflector: Reflector
	) {}

	public async onModuleInit() {
		this.explorerService
			.explore(SLASH_COMMAND_METADATA)
			.forEach(command => this.slashCommands.set(command.getName(), command));

		return this.explorerService.explore(SUBCOMMAND_METADATA).forEach(subcommand => {
			const rootCommand = this.reflector.get<SlashCommandDiscovery>(
				SLASH_COMMAND_METADATA,
				subcommand.getClass()
			);
			const subCommandGroup = this.reflector.get<SlashCommandDiscovery>(
				SUBCOMMAND_GROUP_METADATA,
				subcommand.getClass()
			);

			if (subCommandGroup) {
				subCommandGroup.setCommand(subcommand);
				rootCommand.setCommand(subCommandGroup);
			} else {
				rootCommand.setCommand(subcommand);
			}

			if (!this.slashCommands.has(rootCommand.getName())) {
				this.slashCommands.set(rootCommand.getName(), rootCommand);
			}
		});
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
}
