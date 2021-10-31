import { DynamicModule, Module, Provider } from '@nestjs/common';
import { NecordModuleAsyncOptions, NecordModuleOptions, NecordOptionsFactory } from './interfaces';
import { DiscoveryModule } from '@nestjs/core';
import { ExplorerService, MetadataAccessorService, ApplicationCommandsService } from './services';
import { NecordClient } from './necord-client';
import { MODULE_OPTIONS } from './necord.constants';

@Module({
	imports: [DiscoveryModule],
	providers: [MetadataAccessorService, ExplorerService, ApplicationCommandsService, NecordClient],
	exports: [NecordClient, ApplicationCommandsService]
})
export class NecordModule {
	public static forRoot(options: NecordModuleOptions): DynamicModule {
		return {
			module: NecordModule,
			providers: [
				{
					provide: MODULE_OPTIONS,
					useValue: options
				}
			]
		};
	}

	public static forRootAsync(options: NecordModuleAsyncOptions): DynamicModule {
		return {
			module: NecordModule,
			imports: options.imports,
			providers: this.createAsyncProviders(options)
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
				provide: MODULE_OPTIONS,
				useFactory: async (...args: any[]) => await options.useFactory(...args),
				inject: options.inject || []
			};
		}

		return {
			provide: MODULE_OPTIONS,
			useFactory: async (optionsFactory: NecordOptionsFactory) => await optionsFactory.createNecordOptions(),
			inject: [options.useExisting || options.useClass]
		};
	}
}
