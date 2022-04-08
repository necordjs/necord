import { BaseDiscovery, DiscoveryType } from '../common';

export interface ListenerMeta {
	type: 'once' | 'on';
	event: string;
}

export class ListenerDiscovery extends BaseDiscovery<ListenerMeta> {
	protected type: DiscoveryType.LISTENER;
}
