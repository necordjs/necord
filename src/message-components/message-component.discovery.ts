import { ComponentType, MessageComponentInteraction, MessageComponentType } from 'discord.js';
import { match } from 'path-to-regexp';
import { NecordBaseDiscovery } from '../context';

export interface MessageComponentMeta {
	type: Exclude<MessageComponentType, ComponentType.ActionRow>;
	customId: string;
}

export class MessageComponentDiscovery extends NecordBaseDiscovery<MessageComponentMeta> {
	public readonly matcher = match([this.meta.type.toString(), this.meta.customId].join('_'));

	public getType() {
		return this.meta.type;
	}

	public getCustomId() {
		return this.meta.customId;
	}

	public execute(interaction: MessageComponentInteraction): any {
		return super.execute([interaction]);
	}

	public isMessageComponent(): this is MessageComponentDiscovery {
		return true;
	}

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
