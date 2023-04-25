import { Injectable } from '@nestjs/common';
import { ContextOf, Ctx, MessageCollector, TextCommand } from '../src';
import { Message } from 'discord.js';
import { createApplication } from './utils.spec';

@Injectable()
export class HelloCollector extends MessageCollector {
	public collect(original: Message, message: Message): void {
		message.reply('hi');
	}

	public filter(original: Message, message: Message): boolean {
		return message.content === 'hello';
	}
}

@Injectable()
export class TextCommands {
	public constructor(protected readonly helloCollector: HelloCollector) {}

	@TextCommand({ name: 'hello', description: 'hello' })
	public async hello(@Ctx() [message]: ContextOf<'messageCreate'>) {
		await this.helloCollector.start(message, { max: 5, time: 10000 });
	}
}

createApplication(HelloCollector, TextCommands);
