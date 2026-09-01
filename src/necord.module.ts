import {
	Global,
	Inject,
	Module,
	OnApplicationBootstrap,
	OnApplicationShutdown
} from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { Client } from 'discord.js';

import { ConfigurableModuleClass, NECORD_MODULE_OPTIONS } from './necord.module-definition.js';
import { MessageComponentsModule } from './message-components/index.js';
import { NecordExplorerService } from './necord-explorer.service.js';
import { NecordModuleOptions } from './necord-options.interface.js';
import { NecordContextCreator } from './necord-context.creator.js';
import { TextCommandsModule } from './text-commands/index.js';
import { ListenersModule } from './listeners/index.js';
import * as ProvidersMap from './providers/index.js';
import { CommandsModule } from './commands/index.js';
import { ModalsModule } from './modals/index.js';

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

	public onApplicationShutdown(_signal?: string) {
		return this.client.destroy();
	}
}
