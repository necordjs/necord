import { ClientOptions as DiscordClientOptions, Snowflake } from 'discord.js';
import { ModuleMetadata, Type } from '@nestjs/common';
import { NonEmptyArray } from './non-empty-array.interface';

export interface NecordModuleOptions extends DiscordClientOptions {
	token: string;
	prefix?: string | Function;
	development?: NonEmptyArray<Snowflake> | false;
}

export interface NecordOptionsFactory {
	createNecordOptions(): Promise<NecordModuleOptions> | NecordModuleOptions;
}

export interface NecordModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	useExisting?: Type<NecordOptionsFactory>;
	useClass?: Type<NecordOptionsFactory>;
	useFactory?: (...args: any[]) => Promise<NecordModuleOptions> | NecordModuleOptions;
	inject?: any[];
}
