import { Client, ClientEvents } from 'discord.js';
import { Inject } from '@nestjs/common';
import { NecordEvents } from '../listener.interface';

type OnlyCustomEvents = Exclude<NecordEvents, ClientEvents>;

export abstract class BaseHandler<Events extends Record<string, Array<any>> = OnlyCustomEvents> {
	@Inject(Client)
	private readonly client: Client;

	protected emit<K extends keyof Events>(event: K, ...args: Events[K]) {
		this.client.emit<any>(event, ...args);
	}
}
