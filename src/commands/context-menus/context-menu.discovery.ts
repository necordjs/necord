import {
	ContextMenuCommandInteraction,
	MessageApplicationCommandData,
	PermissionsBitField,
	Snowflake,
	UserApplicationCommandData
} from 'discord.js';
import { GUILDS_METADATA } from '../../necord.constants';
import { RESTPostAPIContextMenuApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { CommandDiscovery } from '../command.discovery';

export type ContextMenuMeta = MessageApplicationCommandData | UserApplicationCommandData;

export class ContextMenuDiscovery extends CommandDiscovery<ContextMenuMeta> {
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
		return super.execute(
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
		return this.meta;
	}
}
