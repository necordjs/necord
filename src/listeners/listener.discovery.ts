import { NecordBaseDiscovery } from '../context';

export interface ListenerMeta {
	type: 'once' | 'on';
	event: string | symbol | number;
	botNames?: string[];
}

export class ListenerDiscovery extends NecordBaseDiscovery<ListenerMeta> {
	public getType() {
		return this.meta.type;
	}

	public getEvent() {
		return this.meta.event.toString();
	}

	public isListener(): this is ListenerDiscovery {
		return true;
	}

	public isForBot(botName: string) {
		return this.meta.botNames?.includes(botName) ?? true;
	}

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
