import {
	Global,
	Inject,
	Module,
	OnApplicationBootstrap,
	OnApplicationShutdown
} from '@nestjs/common';
import { NecordModuleOptions } from './necord-options.interface';
import { ConfigurableModuleClass, NECORD_MODULE_OPTIONS } from './necord.module-definition';
import { TextCommandsService } from './text-commands';
import { ModalsService } from './modals';
import { MessageComponentsService } from './message-components';
import { NecordClientProvider } from './necord-client.provider';
import { ListenersService } from './listeners';
import { ExplorerService } from './necord-explorer.service';
import { CommandsService, ContextMenusService, SlashCommandsService } from './commands';
import { DiscoveryModule } from '@nestjs/core';
import { NecordRestProvider } from './necord-rest.provider';
import { NecordClient } from './necord-client';

@Global()
@Module({
	imports: [DiscoveryModule],
	providers: [
		CommandsService,
		ContextMenusService,
		ExplorerService,
		ListenersService,
		MessageComponentsService,
		ModalsService,
		NecordClientProvider,
		NecordRestProvider,
		SlashCommandsService,
		TextCommandsService
	],
	exports: [
		CommandsService,
		ContextMenusService,
		ExplorerService,
		ListenersService,
		MessageComponentsService,
		ModalsService,
		NecordClientProvider,
		NecordRestProvider,
		SlashCommandsService,
		TextCommandsService
	]
})
export class NecordModule
	extends ConfigurableModuleClass
	implements OnApplicationBootstrap, OnApplicationShutdown
{
	public constructor(
		private readonly client: NecordClient,
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
