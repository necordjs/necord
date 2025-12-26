import { Global, Inject, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { Client } from 'discord.js';

import { NECORD_MODULE_OPTIONS } from '../necord.module-definition';
import { NecordExplorerService } from '../necord-explorer.service';
import { NecordModuleOptions } from '../necord-options.interface';
import { TextCommandDiscovery } from './text-command.discovery';
import { TextCommandsService } from './text-commands.service';
import { TextCommand } from './decorators';

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

	public onModuleInit() {
		const prefix = (this.options.prefix ?? '!');

		return this.explorerService
			.explore(TextCommand.KEY)
			.forEach(textCommand => this.textCommandsService.add(textCommand, prefix));
	}

	public onApplicationBootstrap() {
		return this.client.on('messageCreate', async message => {
			if (!message || !message.content?.length || message.webhookId || message.author.bot)
				return;

			const content = message.content.toLowerCase();

			const args = content.split(/ +/g);
			const cmd = args.shift();

			if (!cmd) return;

			return this.textCommandsService.get(cmd)?.execute([message]);
		});
	}
}
