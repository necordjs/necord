import { Injectable, Logger } from '@nestjs/common';
import { Context, On, Once } from 'necord';
import { Client } from 'discord.js';

@Injectable()
export class AppUpdate {
	private readonly logger = new Logger(AppUpdate.name);

	@Once('ready')
	public async onReady(@Context() client: Client) {
		this.logger.log(`Bot logged in as ${client.user.username}`);
	}

	@On('warn')
	public onWarn(@Context() message: string) {
		this.logger.warn(message);
	}
}
