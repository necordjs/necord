import { NecordMethodDiscovery, NecordMethodDiscoveryType } from '../../context';

export interface TextCommandMeta {
	name: string;
}

export class TextCommandDiscovery extends NecordMethodDiscovery<TextCommandMeta> {
	protected type = NecordMethodDiscoveryType.TEXT_COMMAND;

	public getName() {
		return this.meta.name;
	}
}
