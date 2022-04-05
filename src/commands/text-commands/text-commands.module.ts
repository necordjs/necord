import { Global, Inject, Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { Client } from 'discord.js';
import { TextCommandDiscovery, TextCommandMeta } from './text-command.discovery';
import { NECORD_MODULE_OPTIONS, NecordModuleOptions } from '../../necord-options';
import { TEXT_COMMAND_METADATA } from './text-command.decorator';

@Global()
@Module({
	imports: [DiscoveryModule]
})
export class TextCommandsModule implements OnModuleInit {
	public constructor(
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
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

			return commands.find(command => command.getName() === cmd)?.execute([message], args);
		});
	}
}
