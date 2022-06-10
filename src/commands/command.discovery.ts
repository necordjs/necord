import { PermissionResolvable, Snowflake } from 'discord.js';
import { NecordBaseDiscovery } from '../context';
import { LocalizationMap } from 'discord-api-types/v10';

// TODO: Use BaseApplicationCommandData
export interface BaseApplicationCommandMeta {
	name: string;
	name_localizations?: LocalizationMap;
	dm_permission?: boolean;
	default_member_permissions?: PermissionResolvable;

	// The functionality not released yet https://github.com/discord/discord-api-docs/pull/4965
	// nsfw?: boolean;

	/**
	 * @deprecated Use `dm_permission` and/or `default_member_permissions` instead
	 */
	default_permission?: boolean;
}

export abstract class CommandDiscovery<
	T extends BaseApplicationCommandMeta = BaseApplicationCommandMeta
> extends NecordBaseDiscovery<T> {
	public abstract getGuilds(): Set<Snowflake>;
}
