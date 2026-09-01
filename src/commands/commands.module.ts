import {
	Global,
	Inject,
	Logger,
	Module,
	OnApplicationBootstrap,
	OnModuleInit
} from '@nestjs/common';
import { Client } from 'discord.js';

import { NECORD_MODULE_OPTIONS } from '../necord.module-definition.js';
import { NecordModuleOptions } from '../necord-options.interface.js';
import { SlashCommandsModule } from './slash-commands/index.js';
import { ContextMenusModule } from './context-menus/index.js';
import { CommandsService } from './commands.service.js';

@Global()
@Module({
	imports: [ContextMenusModule, SlashCommandsModule],
	providers: [CommandsService],
	exports: [ContextMenusModule, SlashCommandsModule, CommandsService]
})
export class CommandsModule implements OnApplicationBootstrap, OnModuleInit {
	private readonly logger = new Logger(CommandsModule.name);

	public constructor(
		private readonly client: Client,
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
		private readonly commandsService: CommandsService
	) {}

	public onModuleInit() {
		if (this.options.skipRegistration) {
			return;
		}

		return this.client.once('clientReady', async () => {
			const application = this.client.application;

			if (!application) {
				throw new Error('Discord client application is unavailable after clientReady.');
			}

			if (application.partial) {
				await application.fetch();
			}

			return this.commandsService.registerAllCommands();
		});
	}

	public onApplicationBootstrap() {
		if (!this.options.development || !Array.isArray(this.options.development)) {
			return;
		}

		this.logger.debug('Running in development mode, overriding guilds to all commands');

		// Override all commands guilds to development guilds
		// This is useful for testing commands without having to wait for global commands to update
		// or having to manually add guilds to each command
		// Note: This will only work if development is an array of guild IDs

		const commands = this.commandsService.getCommands();

		for (const command of commands) {
			command.setGuilds(this.options.development);
		}
	}
}
