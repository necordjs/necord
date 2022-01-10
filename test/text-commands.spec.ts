import { Injectable } from '@nestjs/common';
import { TextCommand, Ctx, ContextOf, Opts, NecordRegistry } from '../src';
import { createApplication } from './utils.spec';
import * as assert from 'node:assert';

@Injectable()
class TextCommandsSpec {
	@TextCommand('ping')
	public onPing(@Ctx() [message]: ContextOf<'messageCreate'>) {
		return message.reply('pong!');
	}

	@TextCommand('length')
	public onLength(@Ctx() [message]: ContextOf<'messageCreate'>, @Opts() args: string[]) {
		return message.reply('Your message length - ' + args.join(' ').length);
	}
}

const bootstrap = async () => {
	const app = await createApplication(TextCommandsSpec);
	const registry = app.get(NecordRegistry);

	assert.strictEqual(registry.getTextCommands().length, 2);
	assert.notStrictEqual(registry.getTextCommand('ping'), undefined);
	assert.notStrictEqual(registry.getTextCommand('length'), undefined);
};

bootstrap();
