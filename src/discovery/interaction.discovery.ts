import { Snowflake } from 'discord.js';
import { BaseDiscovery } from './index';

export abstract class InteractionDiscovery extends BaseDiscovery {
	public abstract getGuilds(): Set<Snowflake>;
}
