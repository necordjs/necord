import { Client } from 'discord.js';
import {
	ConfigurableModuleBuilder,
	DynamicModule,
	Global,
	Inject,
	Module,
	OnApplicationBootstrap,
	OnApplicationShutdown,
	Provider
} from '@nestjs/common';
import {
	NecordModuleAsyncOptions,
	NecordModuleOptions,
	NecordOptionsFactory
} from './necord-options.interface';
import { ConfigurableModuleClass, NECORD_MODULE_OPTIONS } from './necord.constants';
import { TextCommandsService } from './text-commands';
import { ModalsService } from './modals';
import { MessageComponentsService } from './message-components';
import { NecordClientProvider } from './necord-client.provider';
import { ListenersService } from './listeners';
import { ExplorerService } from './necord-explorer.service';
import { CommandsService, ContextMenusService, SlashCommandsService } from './commands';
import { DiscoveryModule } from '@nestjs/core';

@Global()
@Module({
	imports: [DiscoveryModule],
	providers: [
		NecordClientProvider,
		CommandsService,
		ExplorerService,
		TextCommandsService,
		ModalsService,
		MessageComponentsService,
		ContextMenusService,
		ListenersService,
		SlashCommandsService
	],
	exports: [
		NecordClientProvider,
		CommandsService,
		SlashCommandsService,
		ContextMenusService,
		MessageComponentsService,
		ModalsService,
		TextCommandsService
	]
})
export class NecordModule
	extends ConfigurableModuleClass
	implements OnApplicationBootstrap, OnApplicationShutdown
{
	public constructor(
		private readonly client: Client,
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions
	) {
		super();
	}

	public onApplicationBootstrap() {
		return this.client.login(this.options.token);
	}

	public onApplicationShutdown(signal?: string) {
		return this.client.destroy();
	}
}
