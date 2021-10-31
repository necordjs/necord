import { Injectable, Logger } from '@nestjs/common';
import { Context, NecordClient, On, OnReady } from 'necord';
import { Client, Message } from 'discord.js';

@Injectable()
export class AppUpdate {
	private readonly logger = new Logger(AppUpdate.name);

	public constructor(private readonly necordClient: NecordClient) {}

	@OnReady
	public async onReady(@Context() client: Client) {
		this.logger.log(`Bot logged in as ${client.user.username}`);
	}

	@On('messageCreate')
	public async onMessageCreate(@Context() message: Message) {
		if (message.author.bot || message.author.id === this.necordClient.user.id) return;

		this.logger.log(`New message from ${message.author.username}`);

		if (message.content.startsWith('!ping')) {
			await message.reply('Pong!');
		}
	}
}
