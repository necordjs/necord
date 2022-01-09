import { Inject, Injectable } from '@nestjs/common';
import { Context, On } from '../decorators';
import { ContextOf, NecordModuleOptions } from '../interfaces';
import { NECORD_MODULE_OPTIONS } from '../necord.constants';
import { Message } from 'discord.js';
import { NecordRegistry } from '../necord-registry';

@Injectable()
export class TextCommandsUpdate {
	private readonly prefix: string | Function;

	public constructor(
		@Inject(NECORD_MODULE_OPTIONS)
		private readonly options: NecordModuleOptions,
		private readonly registry: NecordRegistry
	) {
		this.prefix = this.options.prefix ?? '!';
	}

	@On('messageCreate')
	private async onMessageCreate(@Context() [message]: ContextOf<'messageCreate'>) {
		if (!message || !message.content?.length) return;

		const content = message.content.toLowerCase();
		const prefix = await this.getMessagePrefix(message);

		if (!prefix || !content.startsWith(prefix)) return;

		const args = content.substring(prefix.length).split(/ +/g);
		const cmd = args.shift();

		if (!cmd) return;

		return this.registry.getTextCommand(cmd)?.metadata.execute([message], args);
	}

	private async getMessagePrefix(message: Message) {
		return typeof this.prefix !== 'function' ? this.prefix : await this.prefix(message);
	}
}
