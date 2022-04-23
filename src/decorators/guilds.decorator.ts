import { Snowflake } from 'discord.js';
import { SetMetadata } from '@nestjs/common';
import { GUILDS_METADATA } from '../necord.constants';
import { NonEmptyArray } from '../interfaces';

export const Guilds = (...guildIds: NonEmptyArray<Snowflake>): ClassDecorator & MethodDecorator =>
	SetMetadata<string, Snowflake[]>(GUILDS_METADATA, guildIds);
