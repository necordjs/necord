import { Injectable } from '@nestjs/common';
import { ContextOf, Ctx, Opts, TextCommand } from '../src';
import { createApplication } from './utils.spec';

@Injectable()
class TextCommandsSpec {
	@TextCommand({ name: 'ping',  description: 'ping-pong' })
	public onPing(@Ctx() [message]: ContextOf<'messageCreate'>) {
		return message.reply('pong!');
	}

	@TextCommand({ name: 'length', description: 'length of message' })
	public onLength(@Ctx() [message]: ContextOf<'messageCreate'>, @Opts() args: string[]) {
		return message.reply('Your message length - ' + args.join(' ').length);
	}
}

const bootstrap = async () => {
	const app = await createApplication(TextCommandsSpec);
};

bootstrap();
