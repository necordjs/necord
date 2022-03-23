import { NecordMethodDiscovery, NecordMethodDiscoveryType } from '../context';
import { MessageComponentInteraction, MessageComponentType } from 'discord.js';

export interface ComponentMeta {
	type: Exclude<MessageComponentType, 'ACTION_ROW'>;
	customId: string;
}

export class ComponentDiscovery extends NecordMethodDiscovery<ComponentMeta> {
	protected type = NecordMethodDiscoveryType.MESSAGE_COMPONENT;

	public getComponentType() {
		return this.meta.type;
	}

	public getCustomId() {
		return this.meta.customId;
	}

	public getKey() {
		return [this.meta.type, this.meta.customId].join(':');
	}

	public override execute(interaction: MessageComponentInteraction): any {
		return super.execute([interaction]);
	}
}
