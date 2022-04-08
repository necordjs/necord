import { MessageComponentInteraction, MessageComponentType } from 'discord.js';
import { BaseDiscovery, DiscoveryType } from '../common';

export interface ComponentMeta {
	type: Exclude<MessageComponentType, 'ACTION_ROW'>;
	customId: string;
}

export class MessageComponentDiscovery extends BaseDiscovery<ComponentMeta> {
	protected type = DiscoveryType.MESSAGE_COMPONENT;

	public getComponentType() {
		return this.meta.type;
	}

	public getCustomId() {
		return this.meta.customId;
	}

	public override execute(interaction: MessageComponentInteraction): any {
		return super.execute([interaction]);
	}
}
