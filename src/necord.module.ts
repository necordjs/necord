import { Client } from 'discord.js';
import {
	Global,
	Inject,
	Module,
	OnApplicationBootstrap,
	OnApplicationShutdown
} from '@nestjs/common';
import { NecordModuleOptions } from './necord-options.interface';
import { ConfigurableModuleClass, NECORD_MODULE_OPTIONS } from './necord.module-definition';
import { TextCommandsModule } from './text-commands';
import { ModalsModule } from './modals';
import { MessageComponentsModule } from './message-components';
import * as ProvidersMap from './providers';
import { ListenersModule } from './listeners';
import { ExplorerService } from './necord-explorer.service';
import { CommandsModule } from './commands';
import { DiscoveryModule } from '@nestjs/core';

const Providers = Object.values(ProvidersMap);

@Global()
@Module({
	imports: [
		DiscoveryModule,
		CommandsModule,
		ListenersModule,
		MessageComponentsModule,
		ModalsModule,
		TextCommandsModule
	],
	providers: [ExplorerService, ...Providers],
	exports: [
		CommandsModule,
		ListenersModule,
		MessageComponentsModule,
		ModalsModule,
		TextCommandsModule,
		ExplorerService,
		...Providers,
		NECORD_MODULE_OPTIONS
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
