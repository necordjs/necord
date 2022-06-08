import { PermissionResolvable, Snowflake } from 'discord.js';
import { BaseDiscovery } from '../discovery';
import { LocalizationMap } from 'discord-api-types/v10';

export interface BaseApplicationCommandMeta {
	name: string;
	name_localizations?: LocalizationMap;
	dm_permission?: boolean;
	default_member_permissions?: PermissionResolvable;
	/**
	 * @deprecated Use `dm_permission` and/or `default_member_permissions` instead
	 */
	default_permission?: boolean;
}

export abstract class CommandDiscovery extends BaseDiscovery {
	public abstract getGuilds(): Set<Snowflake>;
}
