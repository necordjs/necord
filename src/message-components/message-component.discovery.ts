import { ComponentType, MessageComponentInteraction, MessageComponentType } from 'discord.js';
import { BaseDiscovery, MethodDiscoveryMixin } from '../discovery';
import { mix } from 'ts-mixer';

export interface MessageComponentMeta {
	type: Exclude<MessageComponentType, ComponentType.ActionRow>;
	customId: string;
}

export interface MessageComponentDiscovery extends MethodDiscoveryMixin<MessageComponentMeta> {}

@mix(MethodDiscoveryMixin)
export class MessageComponentDiscovery extends BaseDiscovery {
	public getComponentType() {
		return this.meta.type;
	}

	public getCustomId() {
		return this.meta.customId;
	}

	public execute(interaction: MessageComponentInteraction): any {
		return this._execute([interaction]);
	}

	public isMessageComponent(): this is MessageComponentDiscovery {
		return true;
	}

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
