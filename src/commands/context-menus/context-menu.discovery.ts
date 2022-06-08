import {
	ApplicationCommandType,
	ContextMenuCommandInteraction,
	PermissionsBitField,
	Snowflake
} from 'discord.js';
import { mix } from 'ts-mixer';
import { GUILDS_METADATA } from '../../necord.constants';
import {
	BaseApplicationCommandMeta,
	CommandDiscovery,
	MethodDiscoveryMixin
} from '../../discovery';
import { RESTPostAPIContextMenuApplicationCommandsJSONBody } from 'discord-api-types/v10';

export interface ContextMenuMeta extends BaseApplicationCommandMeta {
	type: Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput>;
}

export interface ContextMenuDiscovery extends MethodDiscoveryMixin<ContextMenuMeta> {}

@mix(MethodDiscoveryMixin)
export class ContextMenuDiscovery extends CommandDiscovery {
	public getContextType() {
		return this.meta.type;
	}

	public getName() {
		return this.meta.name;
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
