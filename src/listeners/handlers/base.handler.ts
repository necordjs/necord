import { Client } from 'discord.js';
import { NecordEvents } from '../listener.interface';
import { Inject } from '@nestjs/common';

export abstract class BaseHandler {
	@Inject(Client)
	private readonly client: Client;

	protected on<K extends keyof NecordEvents>(event: K, fn: (args: NecordEvents[K]) => void) {
		this.client.on<any>(event, (...args) => fn.call(this, args));
	}

	protected emit<K extends keyof NecordEvents>(event: K, ...args: NecordEvents[K]) {
		this.client.emit<any>(event, ...args);
	}
}
