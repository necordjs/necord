import { mix } from 'ts-mixer';
import { BaseDiscovery, MethodDiscoveryMixin } from '../discovery';

export interface ListenerMeta {
	type: 'once' | 'on';
	event: string | symbol | number;
}

export interface ListenerDiscovery extends MethodDiscoveryMixin<ListenerMeta> {}

@mix(MethodDiscoveryMixin)
export class ListenerDiscovery extends BaseDiscovery {
	public getListenerType() {
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
