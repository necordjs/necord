import { NecordBaseDiscovery } from '../context';

export interface ListenerMeta {
	type: 'once' | 'on';
	event: string | symbol | number;
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

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
