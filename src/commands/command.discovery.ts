import { BaseApplicationCommandData, Snowflake } from 'discord.js';
import { NecordBaseDiscovery } from '../context';
import { GUILDS_METADATA } from '../necord.constants';

export abstract class CommandDiscovery<
	T extends BaseApplicationCommandData = BaseApplicationCommandData
> extends NecordBaseDiscovery<T> {
	public getGuilds(): Set<Snowflake> {
		return new Set(
			this.reflector.getAllAndMerge(
				GUILDS_METADATA,
				[this.getHandler(), this.getClass()].filter(Boolean)
			)
		);
	}
}
