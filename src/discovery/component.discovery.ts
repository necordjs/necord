import { ComponentType, MessageComponentInteraction, MessageComponentType } from 'discord.js';
import { BaseDiscovery, DiscoveryType, MethodDiscoveryMixin } from './mixins';
import { mix } from 'ts-mixer';

export interface ComponentMeta {
	type: Exclude<MessageComponentType, ComponentType.ActionRow>;
	customId: string;
}

export interface ComponentDiscovery extends MethodDiscoveryMixin<ComponentMeta> {}

@mix(MethodDiscoveryMixin)
export class ComponentDiscovery extends BaseDiscovery {
	protected override type = DiscoveryType.MESSAGE_COMPONENT;

	public getComponentType() {
		return this.meta.type;
	}

	public getCustomId() {
		return this.meta.customId;
	}

	public execute(interaction: MessageComponentInteraction): any {
		return this._execute([interaction]);
	}

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
