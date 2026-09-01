import { Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Collection } from 'discord.js';

import { SlashCommand, SubcommandGroup } from './decorators/index.js';
import { SlashCommandDiscovery } from './slash-command.discovery.js';

/**
 * Represents a service that manages slash commands.
 * @url https://necord.org/interactions/slash-commands
 */
@Injectable()
export class SlashCommandsService {
	private readonly logger = new Logger(SlashCommandsService.name);

	public readonly cache = new Collection<string, SlashCommandDiscovery>();

	public constructor(private readonly reflector: Reflector) {}

	public add(command: SlashCommandDiscovery): void {
		if (this.cache.has(command.getName())) {
			this.logger.warn(`Slash Command : ${command.getName()} already exists`);
		}

		this.cache.set(command.getName(), command);
	}

	public get(commandName: string): SlashCommandDiscovery | undefined {
		return this.cache.get(commandName);
	}

	public remove(commandName: string): boolean {
		return this.cache.delete(commandName);
	}

	public addSubCommand(subCommand: SlashCommandDiscovery): void {
		let rootCommand = this.reflector.get<SlashCommandDiscovery>(
			SlashCommand.KEY,
			subCommand.getClass()
		);
		let subCommandGroup = this.reflector.get<SlashCommandDiscovery>(
			SubcommandGroup.KEY,
			subCommand.getClass()
		);

		if (!rootCommand) {
			throw new Error('A subcommand must belong to a root slash command.');
		}

		rootCommand = this.cache.ensure(rootCommand.getName(), () => rootCommand);

		if (subCommandGroup) {
			subCommandGroup = rootCommand.ensureSubcommand(subCommandGroup);
			subCommandGroup.ensureSubcommand(subCommand);
		} else {
			rootCommand.ensureSubcommand(subCommand);
		}
	}
}
