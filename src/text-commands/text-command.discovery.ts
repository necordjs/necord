import { BaseDiscovery, DiscoveryType, MethodDiscoveryMixin } from '../common';
import { mix } from 'ts-mixer';

export interface TextCommandMeta {
	name: string;
	description: string;
}

export interface TextCommandDiscovery extends MethodDiscoveryMixin<TextCommandMeta> {}

@mix(MethodDiscoveryMixin)
export class TextCommandDiscovery extends BaseDiscovery {
	protected type = DiscoveryType.TEXT_COMMAND;

	public getName() {
		return this.meta.name;
	}

	public getDescription() {
		return this.meta.description;
	}

	public toJSON(): Record<string, any> {
		return this.meta;
	}
}
