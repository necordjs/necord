import { Global, Inject, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { ContextMenusModule, ContextMenusService } from './context-menus';
import { SlashCommandsModule, SlashCommandsService } from './slash-commands';
import { CommandsService } from './commands.service';
import { Client } from 'discord.js';
import { NECORD_MODULE_OPTIONS } from '../necord.module-definition';
import { NecordModuleOptions } from '../necord-options.interface';
import { CommandDiscovery } from './command.discovery';

@Global()
@Module({
	imports: [ContextMenusModule, SlashCommandsModule],
	providers: [CommandsService],
	exports: [ContextMenusModule, SlashCommandsModule, CommandsService]
})
export class CommandsModule implements OnModuleInit, OnApplicationBootstrap {
	public constructor(
		private readonly client: Client,
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
		private readonly commandsService: CommandsService,
		private readonly contextMenusService: ContextMenusService,
		private readonly slashCommandsService: SlashCommandsService
	) {}

	public onModuleInit() {
		if (this.options.skipRegistration) {
			return;
		}

		return this.client.once('ready', async () => this.commandsService.register());
	}

	public onApplicationBootstrap() {
		const commands: CommandDiscovery[] = [
			...this.contextMenusService.cache.values(),
			...this.slashCommandsService.cache.values()
		];

		for (const command of commands) {
			if (Array.isArray(this.options.development)) {
				command.setGuilds(this.options.development);
			} else {
				command.setGuilds(command.getGuilds() ?? [undefined]);
			}
		}
	}
}
