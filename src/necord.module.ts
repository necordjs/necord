import {
	DynamicModule,
	Global,
	Inject,
	Logger,
	Module,
	OnApplicationBootstrap,
	OnApplicationShutdown,
	OnModuleInit,
	Provider
} from '@nestjs/common';
import { Client } from 'discord.js';
import { clientProvider, necordContextCreator, TreeService } from './common';
import { ListenersModule } from './listeners';
import { MessageComponentsModule } from './message-components';
import {
	NECORD_MODULE_OPTIONS,
	NecordModuleAsyncOptions,
	NecordModuleOptions,
	NecordOptionsFactory
} from './necord-options';
import { TextCommandsModule } from './text-commands';
import { SLASH_COMMANDS, SlashCommandDiscovery, SlashCommandsModule } from './slash-commands';
import { CONTEXT_MENUS, ContextMenuDiscovery, ContextMenusModule } from './context-menus';

@Global()
@Module({
	imports: [
		ListenersModule,
		MessageComponentsModule,
		ContextMenusModule,
		SlashCommandsModule,
		TextCommandsModule
	],
	providers: [clientProvider, necordContextCreator],
	exports: [clientProvider, NECORD_MODULE_OPTIONS]
})
export class NecordModule implements OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown {
	private readonly logger = new Logger(NecordModule.name);

	public constructor(
		private readonly client: Client,
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
		@Inject(CONTEXT_MENUS)
		private readonly contextMenus: TreeService<ContextMenuDiscovery>,
		@Inject(SLASH_COMMANDS)
		private readonly slashCommands: TreeService<SlashCommandDiscovery>
	) {}

	public onModuleInit() {
		return this.client.once('ready', async client => {
			if (client.application.partial) {
				await client.application.fetch();
			}

			this.logger.log(`Started refreshing application commands.`);
			await client.application.commands.set(
				[...this.contextMenus.toJSON(), ...this.slashCommands.toJSON()],
				'742715858157043793'
			);
			this.logger.log(`Successfully reloaded application commands.`);
		});
	}

	public onApplicationBootstrap() {
		return this.client.login(this.options.token);
	}

	public onApplicationShutdown(signal?: string) {
		return this.client.destroy();
	}

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
}
