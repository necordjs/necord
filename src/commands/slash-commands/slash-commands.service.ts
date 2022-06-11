import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { SlashCommandDiscovery } from './slash-command.discovery';
import { Client, InteractionType } from 'discord.js';
import { SLASH_COMMAND_METADATA } from '../../necord.constants';
import { NecordExplorerService } from '../../necord-explorer.service';
import { CommandDiscovery } from '../command.discovery';

@Injectable()
export class SlashCommandsService implements OnModuleInit, OnApplicationBootstrap {
	private readonly slashCommands = new Map<string, SlashCommandDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: NecordExplorerService
	) {}

	public async onModuleInit() {
		// Normal Commands
		return this.explorerService
			.exploreMethods<SlashCommandDiscovery>(SLASH_COMMAND_METADATA)
			.forEach(command => this.slashCommands.set(command.getName(), command));
		// TODO: Subcommand group
	}

	public onApplicationBootstrap() {
		return this.client.on('interactionCreate', i => {
			if (
				!i.isChatInputCommand() &&
				i.type !== InteractionType.ApplicationCommandAutocomplete
			)
				return;

			const name = [
				i.commandName,
				i.options.getSubcommandGroup(false),
				i.options.getSubcommand(false)
			]
				.filter(Boolean)
				.join('');

			return this.slashCommands.get(name)?.execute(i);
		});
	}

	public getCommands(): CommandDiscovery[] {
		return [...this.slashCommands.values()];
	}
}
