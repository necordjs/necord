import { BaseDiscovery } from '../common';
import { Snowflake } from 'discord.js';

export abstract class InteractionDiscovery extends BaseDiscovery {
	public abstract getGuilds(): Set<Snowflake>;
}
