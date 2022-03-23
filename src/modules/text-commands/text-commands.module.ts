import { DynamicModule, Inject, Module, OnModuleInit, Provider } from '@nestjs/common';
import {
	NecordTextCommandsAsyncOptions,
	NecordTextCommandsOptions,
	NecordTextCommandsOptionsFactory
} from './text-commands-options.interface';
import {
	NECORD_TEXT_COMMANDS_MODULE_OPTIONS,
	TEXT_COMMAND_METADATA
} from './text-commands.constants';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { Client } from 'discord.js';
import { TextCommandDiscovery, TextCommandMeta } from './text-command.discovery';

@Module({
	imports: [DiscoveryModule]
})
export class TextCommandsModule implements OnModuleInit {
	public constructor(
		@Inject(NECORD_TEXT_COMMANDS_MODULE_OPTIONS)
		private readonly options: NecordTextCommandsOptions,
		private readonly discoveryService: DiscoveryService,
		private readonly client: Client
	) {}

	public async onModuleInit() {
		const commands = await this.discoveryService
			.providerMethodsWithMetaAtKey<TextCommandMeta>(TEXT_COMMAND_METADATA)
			.then(methods => methods.map(m => new TextCommandDiscovery(m)));

		this.client.on('messageCreate', async message => {
			if (!message || !message.content?.length || message.webhookId || message.author.bot)
				return;

			const content = message.content.toLowerCase();
			const prefix =
				typeof this.options.prefix !== 'function'
					? this.options.prefix
					: await this.options.prefix(message);

			if (!prefix || !content.startsWith(prefix)) return;

			const args = content.substring(prefix.length).split(/ +/g);
			const cmd = args.shift();

			if (!cmd) return;

			return commands.find(command => command.getName() === cmd).execute([message], args);
		});
	}

	public static forRoot(options: NecordTextCommandsOptions): DynamicModule {
		return {
			module: TextCommandsModule,
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
			module: TextCommandsModule,
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
