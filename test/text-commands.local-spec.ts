import { Injectable } from '@nestjs/common';
import { Arguments, ContextOf, Ctx, TextCommand } from '../src';
import { createApplication } from './utils.local-spec';

@Injectable()
class TextCommandsLocalSpec {
	@TextCommand({ name: 'ping', description: 'ping-pong' })
	public onPing(@Ctx() [message]: ContextOf<'messageCreate'>) {
		return message.reply('pong!');
	}

	@TextCommand({ name: 'length', description: 'length of message' })
	public onLength(@Ctx() [message]: ContextOf<'messageCreate'>, @Arguments() args: string[]) {
		return message.reply('Your message length - ' + args.join(' ').length);
	}
}

createApplication(TextCommandsLocalSpec);
