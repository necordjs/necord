import { BaseApplicationCommandData, Snowflake } from 'discord.js';
import { NecordBaseDiscovery } from '../context';

export interface BaseCommandMeta extends BaseApplicationCommandData {
	guilds?: Snowflake[];
}

export abstract class CommandDiscovery<
	T extends BaseCommandMeta = BaseCommandMeta
> extends NecordBaseDiscovery<T> {
	public getName() {
		return this.meta.name;
	}

	public setGuilds(guilds: Snowflake[]) {
		this.meta.guilds = guilds;
	}

	public hasGuild(guild: Snowflake) {
		return this.meta.guilds?.includes(guild);
	}

	public getGuilds(): Snowflake[] {
		return this.meta.guilds;
	}
}
