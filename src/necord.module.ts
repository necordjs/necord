import {
	Global,
	Inject,
	Module,
	OnApplicationBootstrap,
	OnApplicationShutdown
} from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { Client } from 'discord.js';

import { ConfigurableModuleClass, NECORD_MODULE_OPTIONS } from './necord.module-definition';
import { NecordExplorerService } from './necord-explorer.service';
import { NecordModuleOptions } from './necord-options.interface';
import { NecordContextCreator } from './necord-context.creator';
import { MessageComponentsModule } from './message-components';
import { TextCommandsModule } from './text-commands';
import { ListenersModule } from './listeners';
import * as ProvidersMap from './providers';
import { CommandsModule } from './commands';
import { ModalsModule } from './modals';

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
	providers: [NecordExplorerService, NecordContextCreator, ...Providers],
	exports: [
		CommandsModule,
		ListenersModule,
		MessageComponentsModule,
		ModalsModule,
		TextCommandsModule,
		NecordExplorerService,
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
