import {
	ContextMenuInteraction,
	MessageApplicationCommandData,
	UserApplicationCommandData
} from 'discord.js';
import { BaseDiscovery, DiscoveryType } from '../common';

export type ContextMenuMeta = UserApplicationCommandData | MessageApplicationCommandData;

export class ContextMenuDiscovery extends BaseDiscovery<ContextMenuMeta> {
	protected override type = DiscoveryType.CONTEXT_MENU;

	public getContextType() {
		return this.meta.type;
	}

	public getName() {
		return this.meta.name;
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
