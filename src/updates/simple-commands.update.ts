import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Context, On } from '../decorators';
import { ContextOf, NecordModuleOptions, SimpleCommandMetadata } from '../interfaces';
import { NECORD_MODULE_OPTIONS } from '../necord.constants';
import { Message } from 'discord.js';
import { NecordRegistry } from '../necord-registry';

@Injectable()
export class SimpleCommandsUpdate {
	public constructor(
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
		private readonly registry: NecordRegistry
	) {}

	@On('messageCreate')
	private async onMessageCreate(@Context() [message]: ContextOf<'messageCreate'>) {
		if (!message || !message.content?.length) return;

		const content = message.content.toLowerCase();
		const prefix = await this.getMessagePrefix(message);

		if (!prefix || !content.startsWith(prefix)) return;

		const args = message.content.substring(prefix.length).split(/ +/g);
		const cmd = args.shift()?.toLowerCase();

		if (!cmd) return;

		return this.registry.getSimpleCommand(cmd)?.metadata.execute([message], args);
	}

	private async getMessagePrefix(message: Message) {
		return typeof this.options.prefix !== 'function'
			? this.options.prefix
			: await this.options.prefix(message);
	}
}
