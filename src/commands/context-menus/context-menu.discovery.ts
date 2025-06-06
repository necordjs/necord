import {
	ContextMenuCommandInteraction,
	MessageApplicationCommandData,
	Snowflake,
	UserApplicationCommandData
} from 'discord.js';
import { CommandDiscovery } from '../command.discovery';

/**
 * The context menu metadata.
 */
export type ContextMenuMeta = (MessageApplicationCommandData | UserApplicationCommandData) & {
	guilds?: Snowflake[];
};

/**
 * The context menu discovery.
 * @see CommandDiscovery
 * @see ContextMenuMeta
 */
export class ContextMenuDiscovery extends CommandDiscovery<ContextMenuMeta> {
	/**
	 * Gets the discovery type.
	 */
	public getType() {
		return this.meta.type;
	}

	/**
	 * Type guard for the context menu discovery.
	 */
	public override isContextMenu(): this is ContextMenuDiscovery {
		return true;
	}

	/**
	 * Executes the context menu discovery.
	 * @param interaction The interaction to execute.
	 */
	public override execute(interaction: ContextMenuCommandInteraction): any {
		return super.execute([interaction]);
	}

	/**
	 * Converts the context menu discovery to JSON.
	 */
	public override toJSON() {
		return this.meta;
	}
}
