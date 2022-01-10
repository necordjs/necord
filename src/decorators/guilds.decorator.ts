import { ApplicationCommandPermissionData, Snowflake } from 'discord.js';
import { SetMetadata } from '@nestjs/common';
import { GUILDS_METADATA, PERMISSIONS_METADATA } from '../necord.constants';

export const Guilds = (guildIds: Snowflake[]): ClassDecorator & MethodDecorator =>
	SetMetadata<string, Snowflake[]>(GUILDS_METADATA, guildIds);

export const Permissions = (
	permissions: ApplicationCommandPermissionData[]
): ClassDecorator & MethodDecorator =>
	SetMetadata<string, ApplicationCommandPermissionData[]>(PERMISSIONS_METADATA, permissions);
