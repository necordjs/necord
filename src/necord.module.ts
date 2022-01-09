import {
	DynamicModule,
	Global,
	Inject,
	Module,
	OnApplicationBootstrap,
	OnApplicationShutdown,
	Provider
} from '@nestjs/common';
import { Client } from 'discord.js';
import { DiscoveryModule } from '@nestjs/core';
import { NECORD_MODULE_OPTIONS } from './necord.constants';
import { NecordModuleAsyncOptions, NecordModuleOptions, NecordOptionsFactory } from './interfaces';
import { NecordRegistry } from './necord-registry';
import { NecordExplorer } from './necord-explorer';
import * as Updates from './updates';

@Global()
@Module({
	imports: [DiscoveryModule],
	providers: [NecordExplorer, NecordRegistry, ...Object.values(Updates)],
	exports: [NecordRegistry]
})
export class NecordModule implements OnApplicationBootstrap, OnApplicationShutdown {
	public constructor(
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
		private readonly client: Client,
		private readonly explorer: NecordExplorer,
		private readonly registry: NecordRegistry
	) {}

	public async onApplicationBootstrap() {
		const { listeners, components, contextMenus, slashCommands, textCommands } =
			this.explorer.explore();

		this.registry.registerListeners(listeners);
		this.registry.addTextCommands(textCommands);
		this.registry.addMessageComponents(components);
		this.registry.addContextMenus(contextMenus);
		this.registry.addSlashCommands(slashCommands);

		return this.client.login(this.options.token);
	}

	public onApplicationShutdown(signal?: string) {
		return this.client.destroy();
	}

	public static forRoot(options: NecordModuleOptions): DynamicModule {
		const ClientProvider: Provider<Client> = {
			provide: Client,
			useValue: new Client(options)
		};

		return {
			module: NecordModule,
			providers: [
				{
					provide: NECORD_MODULE_OPTIONS,
					useValue: options
				},
				ClientProvider
			],
			exports: [ClientProvider]
		};
	}

	public static forRootAsync(options: NecordModuleAsyncOptions): DynamicModule {
		const ClientFactoryProvider: Provider<Client> = {
			provide: Client,
			useFactory: (options: NecordModuleOptions) => new Client(options),
			inject: [NECORD_MODULE_OPTIONS]
		};

		return {
			module: NecordModule,
			imports: options.imports,
			providers: this.createAsyncProviders(options).concat(ClientFactoryProvider),
			exports: [ClientFactoryProvider]
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
}
