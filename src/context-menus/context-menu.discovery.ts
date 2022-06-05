import {
	ApplicationCommandType,
	ContextMenuCommandInteraction,
	PermissionResolvable,
	PermissionsBitField,
	Snowflake
} from 'discord.js';
import { mix } from 'ts-mixer';
import {
	DM_PERMISSIONS_METADATA,
	GUILDS_METADATA,
	MEMBER_PERMISSIONS_METADATA
} from '../necord.constants';
import { CommandDiscovery, MethodDiscoveryMixin } from '../discovery';
import {
	LocalizationMap,
	RESTPostAPIContextMenuApplicationCommandsJSONBody
} from 'discord-api-types/v10';

export type ContextMenuMeta = {
	type: Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput>;
	name: string;
	name_localizations?: LocalizationMap;
	dm_permission?: boolean;
	default_member_permissions?: PermissionResolvable;
	/**
	 * @deprecated Use `dm_permission` and/or `default_member_permissions` instead
	 */
	default_permission?: boolean;
};

export interface ContextMenuDiscovery extends MethodDiscoveryMixin<ContextMenuMeta> {}

@mix(MethodDiscoveryMixin)
export class ContextMenuDiscovery extends CommandDiscovery {
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

	public isContextMenu(): this is ContextMenuDiscovery {
		return true;
	}

	public execute(interaction: ContextMenuCommandInteraction): any {
		return this._execute(
			[interaction]
			// ApplicationCommandType.User === this.getContextType()
			// 	? {
			// 		user: interaction.options.getUser('user', false),
			// 		member: interaction.options.getMember('user')
			// 	}
			// 	: { message: interaction.options.getMessage('message', false) }
		);
	}

	public override toJSON(): RESTPostAPIContextMenuApplicationCommandsJSONBody {
		return {
			type: this.meta.type,
			name: this.meta.name,
			name_localizations: this.meta.name_localizations,
			dm_permission: this.meta.dm_permission,
			default_member_permissions: new PermissionsBitField(
				this.meta.default_member_permissions
			).bitfield.toString()
		};
	}
}
