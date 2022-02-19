import { Inject, Injectable } from '@nestjs/common';
import { Context, On } from './decorators';
import { Client } from 'discord.js';
import { ContextOf, NecordModuleOptions } from './interfaces';
import { NECORD_MODULE_OPTIONS } from './necord.constants';
import { NecordRegistry } from './necord-registry';
import { NecordInfoType } from './context';

@Injectable()
export class NecordUpdate {
	private readonly prefix: string | Function;

	public constructor(
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
		private readonly client: Client,
		private readonly registry: NecordRegistry
	) {
		this.prefix = this.options.prefix ?? '!';
	}

	@On('messageCreate')
	private async onMessageCreate(@Context() [message]: ContextOf<'messageCreate'>) {
		if (!message || !message.content?.length || message.webhookId || message.author.bot) return;

		const content = message.content.toLowerCase();
		const prefix = typeof this.prefix !== 'function' ? this.prefix : await this.prefix(message);

		if (!prefix || !content.startsWith(prefix)) return;

		const args = content.substring(prefix.length).split(/ +/g);
		const cmd = args.shift();

		if (!cmd) return;

		return this.registry
			.getTextCommand(cmd)
			?.metadata.execute([message], args, { type: NecordInfoType.TEXT_COMMAND });
	}
}
