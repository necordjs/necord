import { PermissionsBitField, Snowflake } from 'discord.js';
import { BaseDiscovery } from './base.discovery';

export abstract class CommandDiscovery extends BaseDiscovery {
	public abstract getGuilds(): Set<Snowflake>;

	public abstract getMemberPermissions(): PermissionsBitField;

	public abstract getDmPermissions(): boolean;
}
