import { Snowflake } from 'discord.js';
import { SetMetadata } from '@nestjs/common';
import { GUILDS_METADATA } from '../slash-commands.constants';

export const Guilds = (guildIds: Snowflake[]): ClassDecorator & MethodDecorator =>
	SetMetadata<string, Snowflake[]>(GUILDS_METADATA, guildIds);
