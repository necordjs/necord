import { Inject, Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client } from 'discord.js';
import { TextCommandDiscovery } from '../discovery';
import { NECORD_MODULE_OPTIONS, TEXT_COMMAND_METADATA } from '../necord.constants';
import { ExplorerService } from './explorer.service';
import { NecordModuleOptions } from '../interfaces';

@Injectable()
export class TextCommandsService implements OnModuleInit, OnApplicationBootstrap {
	private readonly textCommands = new Map<string, TextCommandDiscovery>();

	public constructor(
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
		private readonly client: Client,
		private readonly explorerService: ExplorerService
	) {}

	public onModuleInit() {
		return this.explorerService.explore(
			TEXT_COMMAND_METADATA,
			TextCommandDiscovery,
			textCommand => this.textCommands.set(textCommand.getName(), textCommand)
		);
	}

	public onApplicationBootstrap() {
		return this.client.on('messageCreate', async message => {
			if (!message || !message.content?.length || message.webhookId || message.author.bot)
				return;

			const content = message.content.toLowerCase();
			const prefix =
				typeof this.options.prefix !== 'function'
					? this.options.prefix ?? '!'
					: await this.options.prefix(message);

			if (!prefix || !content.startsWith(prefix)) return;

			const args = content.substring(prefix.length).split(/ +/g);
			const cmd = args.shift();

			if (!cmd) return;

			return this.textCommands.get(cmd)?.execute([message], args);
		});
	}
}
