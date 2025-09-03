import {
	Global,
	Inject,
	Logger,
	Module,
	OnApplicationBootstrap,
	OnModuleInit
} from '@nestjs/common';
import { ContextMenusModule } from './context-menus';
import { SlashCommandsModule } from './slash-commands';
import { CommandsService } from './commands.service';
import { Client } from 'discord.js';
import { NECORD_MODULE_OPTIONS } from '../necord.module-definition';
import { NecordModuleOptions } from '../necord-options.interface';

@Global()
@Module({
	imports: [ContextMenusModule, SlashCommandsModule],
	providers: [CommandsService],
	exports: [ContextMenusModule, SlashCommandsModule, CommandsService]
})
export class CommandsModule implements OnModuleInit, OnApplicationBootstrap {
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
			if (this.client.application.partial) {
				await this.client.application.fetch();
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
