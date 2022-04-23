import {
	ContextMenuInteraction,
	MessageApplicationCommandData,
	Snowflake,
	UserApplicationCommandData
} from 'discord.js';
import { DiscoveryType, MethodDiscoveryMixin } from '../../common';
import { mix } from 'ts-mixer';
import { GUILDS_METADATA } from '../../necord.constants';
import { InteractionDiscovery } from '../interaction.discovery';

export type ContextMenuMeta = UserApplicationCommandData | MessageApplicationCommandData;

export interface ContextMenuDiscovery extends MethodDiscoveryMixin<ContextMenuMeta> {}

@mix(MethodDiscoveryMixin)
export class ContextMenuDiscovery extends InteractionDiscovery {
	protected override type = DiscoveryType.CONTEXT_MENU;

	public getContextType() {
		return this.meta.type;
	}

	public getName() {
		return this.meta.name;
	}

	public getGuilds(): Set<Snowflake> {
		return new Set(
			this.reflector.getAllAndMerge(GUILDS_METADATA, [this.getHandler(), this.getClass()])
		);
	}

	public execute(interaction: ContextMenuInteraction): any {
		return this._execute(
			[interaction],
			'USER' === this.getContextType()
				? {
						user: interaction.options.getUser('user', false),
						member: interaction.options.getMember('user', false)
				  }
				: { message: interaction.options.getMessage('message', false) },
			this
		);
	}

	public toJSON() {
		return this.meta;
	}
}
