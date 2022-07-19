import { BaseApplicationCommandData, Snowflake } from 'discord.js';
import { NecordBaseDiscovery } from '../context';
import { GUILDS_METADATA } from '../necord.constants';

export abstract class CommandDiscovery<
	T extends BaseApplicationCommandData = BaseApplicationCommandData
> extends NecordBaseDiscovery<T> {
	public getName() {
		return this.meta.name;
	}

	public getGuilds(): Snowflake[] {
		return this.reflector.getAllAndMerge<Snowflake[]>(GUILDS_METADATA, [
			this.getHandler(),
			this.getClass()
		]);
	}
}
