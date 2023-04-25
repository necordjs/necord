import { BaseApplicationCommandData, Snowflake } from 'discord.js';
import { NecordBaseDiscovery } from '../context';

export interface BaseCommandData extends BaseApplicationCommandData {
	guilds?: Snowflake[];
}

export abstract class CommandDiscovery<
	T extends BaseCommandData = BaseCommandData
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
