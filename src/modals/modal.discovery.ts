import { mix } from 'ts-mixer';
import { BaseDiscovery, MethodDiscoveryMixin } from '../discovery';
import { ModalSubmitInteraction } from 'discord.js';

export interface ModalMeta {
	customId: string;
}

export interface ModalDiscovery extends MethodDiscoveryMixin<ModalMeta> {}

@mix(MethodDiscoveryMixin)
export class ModalDiscovery extends BaseDiscovery {
	public getCustomId() {
		return this.meta.customId;
	}

	public execute(interaction: ModalSubmitInteraction) {
		return this._execute([interaction]);
	}

	public isModal(): this is ModalDiscovery {
		return true;
	}

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
