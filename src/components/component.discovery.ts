import { MessageComponentInteraction, MessageComponentType } from 'discord.js';
import { BaseDiscovery, DiscoveryType, MethodDiscoveryMixin } from '../common';
import { mix } from 'ts-mixer';

export interface ComponentMeta {
	type: Exclude<MessageComponentType, 'ACTION_ROW'>;
	customId: string;
}

export interface ComponentDiscovery extends MethodDiscoveryMixin<ComponentMeta> {}

@mix(MethodDiscoveryMixin)
export class ComponentDiscovery extends BaseDiscovery {
	protected type = DiscoveryType.MESSAGE_COMPONENT;

	public getComponentType() {
		return this.meta.type;
	}

	public getCustomId() {
		return this.meta.customId;
	}

	public execute(interaction: MessageComponentInteraction): any {
		return this._execute([interaction], null, this);
	}

	public toJSON(): Record<string, any> {
		return this.meta;
	}
}
