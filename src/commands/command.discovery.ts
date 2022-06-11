import { BaseApplicationCommandData, Snowflake } from 'discord.js';
import { NecordBaseDiscovery } from '../context';

export abstract class CommandDiscovery<
	T extends BaseApplicationCommandData = BaseApplicationCommandData
> extends NecordBaseDiscovery<T> {
	public abstract getGuilds(): Set<Snowflake>;
}
