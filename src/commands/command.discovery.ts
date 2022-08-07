import { BaseApplicationCommandData, Snowflake } from 'discord.js';
import { NecordBaseDiscovery } from '../context';

export abstract class CommandDiscovery<
	T extends BaseApplicationCommandData & { guilds?: Snowflake[] } = BaseApplicationCommandData
> extends NecordBaseDiscovery<T> {
	public getName() {
		return this.meta.name;
	}

	public getGuilds(): Snowflake[] {
		return this.meta.guilds;
	}
}
