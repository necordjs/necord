import { mix } from 'ts-mixer';
import { BaseDiscovery, DiscoveryType, MethodDiscoveryMixin } from './mixins';

export interface TextCommandMeta {
	name: string;
	description: string;
}

export interface TextCommandDiscovery extends MethodDiscoveryMixin<TextCommandMeta> {}

@mix(MethodDiscoveryMixin)
export class TextCommandDiscovery extends BaseDiscovery {
	protected override type = DiscoveryType.TEXT_COMMAND;

	public getName() {
		return this.meta.name;
	}

	public getDescription() {
		return this.meta.description;
	}

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
