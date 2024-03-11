import { BaseApplicationCommandData, Snowflake } from 'discord.js';
import { NecordBaseDiscovery } from '../context';

export interface BaseCommandMeta extends BaseApplicationCommandData {
	guilds?: Snowflake[];
}

/**
 * Represents a command discovery.
 * @abstract
 * @url https://necord.org/interactions/slash-commands
 */
export abstract class CommandDiscovery<
	T extends BaseCommandMeta = BaseCommandMeta
> extends NecordBaseDiscovery<T> {
	/**
	 * Returns the command name.
	 */
	public getName() {
		return this.meta.name;
	}

	/**
	 * Sets the command guilds for register.
	 * @param guilds
	 */
	public setGuilds(guilds: Snowflake[]) {
		this.meta.guilds = guilds;
	}

	/**
	 * Checks if the command has a guild.
	 */
	public hasGuild(guild: Snowflake) {
		return this.meta.guilds?.includes(guild);
	}

	/**
	 * Returns the guilds.
	 */
	public getGuilds(): Snowflake[] {
		return this.meta.guilds;
	}
}
