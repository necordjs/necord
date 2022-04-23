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
	AutocompleteService,
	ComponentsService,
	ContextMenusService,
	ExplorerService,
	InteractionsService,
	ListenersService,
	SlashCommandsService,
	TextCommandsService
} from './services';
import { NecordModuleAsyncOptions, NecordModuleOptions, NecordOptionsFactory } from './interfaces';
import { ClientProvider, ContextMenusProvider, SlashCommandsProvider } from './providers';
import { NECORD_MODULE_OPTIONS } from './necord.constants';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { NecordContextCreator } from './context';

@Global()
@Module({
	imports: [DiscoveryModule],
	providers: [
		ClientProvider,
		ContextMenusProvider,
		SlashCommandsProvider,
		NecordContextCreator,
		ExplorerService,
		ListenersService,
		TextCommandsService,
		ComponentsService,
		AutocompleteService,
		SlashCommandsService,
		ContextMenusService,
		InteractionsService
	],
	exports: [ClientProvider]
})
export class NecordModule implements OnApplicationBootstrap, OnApplicationShutdown {
	public constructor(
		private readonly client: Client,
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions
	) {}

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

	public onApplicationBootstrap() {
		return this.client.login(this.options.token);
	}

	public onApplicationShutdown(signal?: string) {
		return this.client.destroy();
	}
}
