import { mix } from 'ts-mixer';
import { BaseDiscovery, MethodDiscoveryMixin } from '../discovery';

export interface TextCommandMeta {
	name: string;
	description: string;
}

export interface TextCommandDiscovery extends MethodDiscoveryMixin<TextCommandMeta> {}

@mix(MethodDiscoveryMixin)
export class TextCommandDiscovery extends BaseDiscovery {
	public getName() {
		return this.meta.name;
	}

	public getDescription() {
		return this.meta.description;
	}

	public isTextCommand(): this is TextCommandDiscovery {
		return true;
	}

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
