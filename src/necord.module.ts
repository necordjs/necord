import { Client } from 'discord.js';
import {
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
import { NECORD_MODULE_OPTIONS } from './necord.constants';
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
	exports: [NecordClientProvider, CommandsService, SlashCommandsService]
})
export class NecordModule implements OnApplicationBootstrap, OnApplicationShutdown {
	public static forRoot(options: NecordModuleOptions): DynamicModule {
		return {
			module: NecordModule,
			providers: [
				{
					provide: NECORD_MODULE_OPTIONS,
					useValue: options
				}
			],
			exports: []
		};
	}

	public static forRootAsync(options: NecordModuleAsyncOptions): DynamicModule {
		return {
			module: NecordModule,
			imports: options.imports,
			providers: this.createAsyncProviders(options),
			exports: []
		};
	}

	private static createAsyncProviders(options: NecordModuleAsyncOptions): Provider[] {
		if (options.useExisting || options.useFactory) {
			return [this.createAsyncOptionsProvider(options)];
		}

		return [
			this.createAsyncOptionsProvider(options),
			{
				provide: options.useClass,
				useClass: options.useClass
			}
		];
	}

	private static createAsyncOptionsProvider(options: NecordModuleAsyncOptions): Provider {
		if (options.useFactory) {
			return {
				provide: NECORD_MODULE_OPTIONS,
				useFactory: async (...args: any[]) => await options.useFactory(...args),
				inject: options.inject || []
			};
		}

		return {
			provide: NECORD_MODULE_OPTIONS,
			useFactory: async (optionsFactory: NecordOptionsFactory) =>
				await optionsFactory.createNecordOptions(),
			inject: [options.useExisting || options.useClass]
		};
	}

	public constructor(
		private readonly client: Client,
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions
	) {}

	public onApplicationBootstrap() {
		return this.client.login(this.options.token);
	}

	public onApplicationShutdown(signal?: string) {
		return this.client.destroy();
	}
}
