import {
	ContextMenuInteraction,
	MessageApplicationCommandData,
	Permissions,
	Snowflake,
	UserApplicationCommandData
} from 'discord.js';
import { mix } from 'ts-mixer';
import {
	DM_PERMISSIONS_METADATA,
	GUILDS_METADATA,
	MEMBER_PERMISSIONS_METADATA
} from '../necord.constants';
import { DiscoveryType, MethodDiscoveryMixin, CommandDiscovery } from './mixins';

export type ContextMenuMeta = UserApplicationCommandData | MessageApplicationCommandData;

export interface ContextMenuDiscovery extends MethodDiscoveryMixin<ContextMenuMeta> {}

@mix(MethodDiscoveryMixin)
export class ContextMenuDiscovery extends CommandDiscovery {
	protected override type = DiscoveryType.CONTEXT_MENU;

	public getContextType() {
		return this.meta.type;
	}

	public getName() {
		return this.meta.name;
	}

	public getDmPermissions(): boolean {
		return this.reflector.getAllAndOverride(DM_PERMISSIONS_METADATA, [
			this.getHandler(),
			this.getClass()
		]);
	}

	public getMemberPermissions(): Permissions {
		return this.reflector.getAllAndOverride(MEMBER_PERMISSIONS_METADATA, [
			this.getHandler(),
			this.getClass()
		]);
	}

	public override getGuilds(): Set<Snowflake> {
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
				: { message: interaction.options.getMessage('message', false) }
		);
	}

	public override toJSON() {
		return this.meta;
	}
}
