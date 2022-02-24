import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
	NecordTextCommandsAsyncOptions,
	NecordTextCommandsOptions,
	NecordTextCommandsOptionsFactory
} from './necord-text-commands-options.interface';
import { NECORD_TEXT_COMMANDS_MODULE_OPTIONS } from './necord-text-commands.constants';
import { NecordTextCommandsUpdate } from './necord-text-commands.update';

@Module({
	providers: [NecordTextCommandsUpdate]
})
export class NecordTextCommandsModule {
	public static forRoot(options: NecordTextCommandsOptions): DynamicModule {
		return {
			module: NecordTextCommandsModule,
			providers: [
				{
					provide: NECORD_TEXT_COMMANDS_MODULE_OPTIONS,
					useValue: options
				}
			]
		};
	}

	public static forRootAsync(options: NecordTextCommandsAsyncOptions): DynamicModule {
		return {
			module: NecordTextCommandsModule,
			imports: options.imports,
			providers: this.createAsyncProviders(options)
		};
	}

	private static createAsyncProviders(options: NecordTextCommandsAsyncOptions): Provider[] {
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

	private static createAsyncOptionsProvider(options: NecordTextCommandsAsyncOptions): Provider {
		if (options.useFactory) {
			return {
				provide: NECORD_TEXT_COMMANDS_MODULE_OPTIONS,
				useFactory: async (...args: any[]) => await options.useFactory(...args),
				inject: options.inject || []
			};
		}

		return {
			provide: NECORD_TEXT_COMMANDS_MODULE_OPTIONS,
			useFactory: async (optionsFactory: NecordTextCommandsOptionsFactory) =>
				await optionsFactory.createNecordTextCommandsOptions(),
			inject: [options.useExisting || options.useClass]
		};
	}
}
