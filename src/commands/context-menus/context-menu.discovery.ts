import { NecordMethodDiscovery, NecordMethodDiscoveryType } from '../../context';
import {
	ContextMenuInteraction,
	MessageApplicationCommandData,
	UserApplicationCommandData
} from 'discord.js';

export type ContextMenuMeta = UserApplicationCommandData | MessageApplicationCommandData;

export class ContextMenuDiscovery extends NecordMethodDiscovery<ContextMenuMeta> {
	protected type = NecordMethodDiscoveryType.CONTEXT_MENU;

	public getContextType() {
		return this.meta.type;
	}

	public getName() {
		return this.meta.name;
	}

	public getKey() {
		return [this.meta.type, this.meta.name].join(':');
	}

	public override execute(interaction: ContextMenuInteraction): any {
		const options =
			'USER' === this.getContextType()
				? {
						user: interaction.options.getUser('user', false),
						member: interaction.options.getMember('user', false)
				  }
				: { message: interaction.options.getMessage('message', false) };

		return super.execute([interaction], options);
	}

	public toJSON() {
		return this.meta;
	}
}
