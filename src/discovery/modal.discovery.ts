import { mix } from 'ts-mixer';
import { BaseDiscovery, DiscoveryType, MethodDiscoveryMixin } from './mixins';
import { ModalSubmitInteraction } from 'discord.js';

export interface ModalMeta {
	customId: string;
}

export interface ModalDiscovery extends MethodDiscoveryMixin<ModalMeta> {}

@mix(MethodDiscoveryMixin)
export class ModalDiscovery extends BaseDiscovery {
	protected override type = DiscoveryType.TEXT_COMMAND;

	public getCustomId() {
		return this.meta.customId;
	}

	public execute(interaction: ModalSubmitInteraction) {
		return this._execute([interaction], interaction.fields);
	}

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
