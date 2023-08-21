import { Injectable, Logger } from '@nestjs/common';
import { SlashCommandDiscovery } from './slash-command.discovery';
import { Client, Collection } from 'discord.js';
import { ExplorerService } from '../../necord-explorer.service';
import { Reflector } from '@nestjs/core';
import { SlashCommand, Subcommand, SubcommandGroup } from './decorators';

@Injectable()
export class SlashCommandsService {
	private readonly logger = new Logger(SlashCommandsService.name);

	public readonly cache = new Collection<string, SlashCommandDiscovery>();

	public constructor(
		private readonly client: Client,
		private readonly explorerService: ExplorerService<SlashCommandDiscovery>,
		private readonly reflector: Reflector
	) {}

	private onModuleInit() {
		this.explorerService.explore(SlashCommand.KEY).forEach(command => this.add(command));

		return this.explorerService
			.explore(Subcommand.KEY)
			.forEach(subcommand => this.addSubCommand(subcommand));
	}

	private onApplicationBootstrap() {
		return this.client.on('interactionCreate', i => {
			if (!i.isChatInputCommand() && !i.isAutocomplete()) return;

			return this.get(i.commandName)?.execute(i);
		});
	}

	public add(command: SlashCommandDiscovery): void {
		if (this.cache.has(command.getName())) {
			this.logger.warn(`Slash Command : ${command.getName()} already exists`);
		}

		this.cache.set(command.getName(), command);
	}

	public get(commandName: string): SlashCommandDiscovery {
		return this.cache.get(commandName);
	}

	public remove(commandName: string): boolean {
		return this.cache.delete(commandName);
	}

	private addSubCommand(subCommand: SlashCommandDiscovery): void {
		const rootCommand = this.reflector.get<SlashCommandDiscovery>(
			SlashCommand.KEY,
			subCommand.getClass()
		);
		const subCommandGroup = this.reflector.get<SlashCommandDiscovery>(
			SubcommandGroup.KEY,
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

		if (!this.cache.has(rootCommand.getName())) {
			this.cache.set(rootCommand.getName(), rootCommand);
		}
	}
}
