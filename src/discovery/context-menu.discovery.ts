import {
	ApplicationCommandType,
	ContextMenuCommandInteraction,
	PermissionsBitField,
	Snowflake
} from 'discord.js';
import { mix } from 'ts-mixer';
import {
	DM_PERMISSIONS_METADATA,
	GUILDS_METADATA,
	MEMBER_PERMISSIONS_METADATA
} from '../necord.constants';
import { CommandDiscovery, DiscoveryType, MethodDiscoveryMixin } from './mixins';
import { RESTPostAPIContextMenuApplicationCommandsJSONBody } from 'discord-api-types/v10';

export interface ContextMenuDiscovery
	extends MethodDiscoveryMixin<RESTPostAPIContextMenuApplicationCommandsJSONBody> {}

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

	public getMemberPermissions(): PermissionsBitField {
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

	public execute(interaction: ContextMenuCommandInteraction): any {
		return this._execute(
			[interaction],
			ApplicationCommandType.User === this.getContextType()
				? {
						user: interaction.options.getUser('user', false),
						member: interaction.options.getMember('user')
				  }
				: { message: interaction.options.getMessage('message', false) }
		);
	}

	public override toJSON(): RESTPostAPIContextMenuApplicationCommandsJSONBody {
		return this.meta;
	}
}
