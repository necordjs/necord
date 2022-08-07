import {
	ContextMenuCommandInteraction,
	MessageApplicationCommandData,
	Snowflake,
	UserApplicationCommandData
} from 'discord.js';
import { CommandDiscovery } from '../command.discovery';

export type ContextMenuMeta = (MessageApplicationCommandData | UserApplicationCommandData) & {
	guilds?: Snowflake[];
};

export class ContextMenuDiscovery extends CommandDiscovery<ContextMenuMeta> {
	public getType() {
		return this.meta.type;
	}

	public isContextMenu(): this is ContextMenuDiscovery {
		return true;
	}

	public execute(interaction: ContextMenuCommandInteraction): any {
		return super.execute([interaction]);
	}

	public override toJSON() {
		return this.meta;
	}
}
