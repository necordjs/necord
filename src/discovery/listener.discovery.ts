import { mix } from 'ts-mixer';
import { BaseDiscovery, DiscoveryType, MethodDiscoveryMixin } from './mixins';

export interface ListenerMeta {
	type: 'once' | 'on';
	event: string | symbol | number;
}

export interface ListenerDiscovery extends MethodDiscoveryMixin<ListenerMeta> {}

@mix(MethodDiscoveryMixin)
export class ListenerDiscovery extends BaseDiscovery {
	protected override type = DiscoveryType.LISTENER;

	public getListenerType() {
		return this.meta.type;
	}

	public getEvent() {
		return this.meta.event.toString();
	}

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
