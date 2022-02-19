import { DynamicModule, Module, Provider } from '@nestjs/common';
import { NECORD_REST_MODULE_OPTIONS } from './necord-rest.constants';
import {
	NecordRestModuleAsyncOptions,
	NecordRestModuleOptions,
	NecordRestOptionsFactory
} from './necord-rest-options.interface';
import { REST } from '@discordjs/rest';

const restProvider: Provider<REST> = {
	provide: REST,
	useFactory: (options: NecordRestModuleOptions) => new REST(options).setToken(options.token),
	inject: [NECORD_REST_MODULE_OPTIONS]
};

@Module({
	providers: [restProvider],
	exports: [restProvider]
})
export class NecordRestModule {
	public static forRoot(options: NecordRestModuleOptions): DynamicModule {
		return {
			global: !!options.isGlobal,
			module: NecordRestModule,
			providers: [
				{
					provide: NECORD_REST_MODULE_OPTIONS,
					useValue: options
				}
			]
		};
	}

	public static forRootAsync(options: NecordRestModuleAsyncOptions): DynamicModule {
		return {
			global: !!options.isGlobal,
			module: NecordRestModule,
			imports: options.imports,
			providers: this.createAsyncProviders(options)
		};
	}

	private static createAsyncProviders(options: NecordRestModuleAsyncOptions): Provider[] {
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

	private static createAsyncOptionsProvider(options: NecordRestModuleAsyncOptions): Provider {
		if (options.useFactory) {
			return {
				provide: NECORD_REST_MODULE_OPTIONS,
				useFactory: async (...args: any[]) => await options.useFactory(...args),
				inject: options.inject || []
			};
		}

		return {
			provide: NECORD_REST_MODULE_OPTIONS,
			useFactory: async (optionsFactory: NecordRestOptionsFactory) =>
				await optionsFactory.createNecordRestOptions(),
			inject: [options.useExisting || options.useClass]
		};
	}
}
