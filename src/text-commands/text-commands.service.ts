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

	public add(textCommand: TextCommandDiscovery) {
		const name = textCommand.getName();
		const aliases = textCommand.getAliases();

		if (this.cache.has(name)) {
			this.logger.warn(`TextCommand : ${name} already exists`);
		}

		const variants = [name, ...aliases];

		for (const variant of variants) {
			if (this.cache.has(variant)) {
				this.logger.warn(`TextCommand : ${variant} already exists`);
			}

			this.cache.set(variant, textCommand);
		}
	}

	public get(name: string) {
		return this.cache.get(name);
	}

	public remove(name: string) {
		this.cache.delete(name);
	}
}
