import { Global, Inject, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client } from 'discord.js';

import { NECORD_MODULE_OPTIONS } from '../necord.module-definition.js';
import { NecordExplorerService } from '../necord-explorer.service.js';
import { NecordModuleOptions } from '../necord-options.interface.js';
import { TextCommandDiscovery } from './text-command.discovery.js';
import { TextCommandsService } from './text-commands.service.js';
import { TextCommand } from './decorators/index.js';

@Global()
@Module({
	providers: [TextCommandsService],
	exports: [TextCommandsService]
})
export class TextCommandsModule implements OnApplicationBootstrap, OnModuleInit {
	public constructor(
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
		private readonly client: Client,
		private readonly explorerService: NecordExplorerService<TextCommandDiscovery>,
		private readonly textCommandsService: TextCommandsService
	) {}

	public async onModuleInit() {
		return this.explorerService
			.explore(TextCommand.KEY)
			.forEach(textCommand => this.textCommandsService.add(textCommand));
	}

	public onApplicationBootstrap() {
		return this.client.on('messageCreate', async message => {
			if (!message || !message.content?.length || message.webhookId || message.author.bot)
				return;

			const content = message.content.toLowerCase();

			const prefix =
				typeof this.options.prefix !== 'function'
					? (this.options.prefix ?? '!')
					: await this.options.prefix(message);

			let contentWithoutPrefix = '';

			const hasPrefix = prefix && content.startsWith(prefix);

			if (hasPrefix) {
				contentWithoutPrefix = content.slice(prefix.length);
			} else if (this.options.allowTextCommandsWithoutPrefix) {
				contentWithoutPrefix = content;
			}

			if (!contentWithoutPrefix) return;

			const args = contentWithoutPrefix.trim().split(/ +/g);
			const cmd = args.shift();

			if (!cmd) return;

			return this.textCommandsService.get(cmd)?.execute([message]);
		});
	}
}
