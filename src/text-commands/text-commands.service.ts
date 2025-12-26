import { Injectable, Logger } from '@nestjs/common';
import { Collection } from 'discord.js';
import { TextCommandDiscovery } from './text-command.discovery';

/**
 * Service that manages text commands.
 */
@Injectable()
export class TextCommandsService {
	private readonly logger = new Logger(TextCommandsService.name);

	public readonly cache = new Collection<string, TextCommandDiscovery>();

	public add(textCommand: TextCommandDiscovery, prefix) {
		const name = textCommand.getName();
		const aliases = textCommand.getAliases() || [];

		if (this.cache.has(name)) {
			this.logger.warn(`TextCommand : ${name} already exists`);
		}

		aliases.forEach((aliase) => {
			this.cache.set(aliase, textCommand);
		});

		this.cache.set(`${prefix ?? ""}${name}`, textCommand);
	}

	public get(name: string) {
		return this.cache.get(name);
	}

	public remove(name: string) {
		this.cache.delete(name);
	}
}
