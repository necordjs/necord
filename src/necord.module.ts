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
import { clientProvider, ExplorerService, NecordContextCreator } from './common';
import { ListenersModule } from './listeners';
import {
	NECORD_MODULE_OPTIONS,
	NecordModuleAsyncOptions,
	NecordModuleOptions,
	NecordOptionsFactory
} from './necord.options';
import { TextCommandsModule } from './text-commands';
import { InteractionsModule } from './interactions';
import { ComponentsModule } from './components';

@Global()
@Module({
	imports: [ListenersModule, InteractionsModule, ComponentsModule, TextCommandsModule],
	providers: [clientProvider, NecordContextCreator, ExplorerService],
	exports: [clientProvider, NECORD_MODULE_OPTIONS, ExplorerService]
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
