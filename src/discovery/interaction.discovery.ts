import { Snowflake } from 'discord.js';
import { BaseDiscovery } from './mixins';

export abstract class InteractionDiscovery extends BaseDiscovery {
	public abstract getGuilds(): Set<Snowflake>;
}
