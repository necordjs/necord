import { Injectable, Logger } from '@nestjs/common';
import { Context, ContextOf, Ctx, On, Opts, TextCommand } from '../src';
import { createApplication } from './utils.spec';

@Injectable()
class TextCommandsSpec {
	@On('debug')
	public onDebug(@Context() [message]: ContextOf<'debug'>) {
		Logger.debug(message);
	}

	@TextCommand('ping', 'ping-pong')
	public onPing(@Ctx() [message]: ContextOf<'messageCreate'>) {
		return message.reply('pong!');
	}

	@TextCommand('length', 'length')
	public onLength(@Ctx() [message]: ContextOf<'messageCreate'>, @Opts() args: string[]) {
		return message.reply('Your message length - ' + args.join(' ').length);
	}
}

const bootstrap = async () => {
	const app = await createApplication(TextCommandsSpec);
};

bootstrap();
