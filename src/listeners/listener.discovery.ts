import { NecordMethodDiscovery, NecordMethodDiscoveryType } from '../context';

export interface ListenerMeta {
	type: 'once' | 'on';
	event: string;
}

export class ListenerDiscovery extends NecordMethodDiscovery<ListenerMeta> {
	protected type: NecordMethodDiscoveryType.LISTENER;
}
