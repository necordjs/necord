import { Inject, Injectable } from '@nestjs/common';
import { NecordTextCommandsOptions } from './necord-text-commands-options.interface';
import { NECORD_TEXT_COMMANDS_MODULE_OPTIONS } from './necord-text-commands.constants';
import { Context, On } from '../../decorators';
import { ContextOf } from '../../interfaces';
import { NecordInfoType } from '../../context';
import { NecordRegistry } from '../../necord-registry';

@Injectable()
export class NecordTextCommandsUpdate {
	public constructor(
		@Inject(NECORD_TEXT_COMMANDS_MODULE_OPTIONS)
		private readonly options: NecordTextCommandsOptions,
		private readonly registry: NecordRegistry
	) {}

	@On('messageCreate')
	private async onMessageCreate(@Context() [message]: ContextOf<'messageCreate'>) {
		if (!message || !message.content?.length || message.webhookId || message.author.bot) return;

		const content = message.content.toLowerCase();
		const prefix =
			typeof this.options.prefix !== 'function'
				? this.options.prefix
				: await this.options.prefix(message);

		if (!prefix || !content.startsWith(prefix)) return;

		const args = content.substring(prefix.length).split(/ +/g);
		const cmd = args.shift();

		if (!cmd) return;

		return this.registry
			.getTextCommand(cmd)
			?.metadata.execute([message], args, { type: NecordInfoType.TEXT_COMMAND });
	}
}
