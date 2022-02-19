import { ModuleMetadata, Type } from '@nestjs/common';
import { ClientOptions as DiscordClientOptions, Snowflake } from 'discord.js';
import { RESTOptions } from '@discordjs/rest';

export interface NecordRestModuleOptions extends Partial<RESTOptions> {
	isGlobal?: boolean;
	token: string;
}

export interface NecordRestOptionsFactory {
	createNecordRestOptions(): Promise<NecordRestModuleOptions> | NecordRestModuleOptions;
}

export interface NecordRestModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	isGlobal?: boolean;
	useExisting?: Type<NecordRestOptionsFactory>;
	useClass?: Type<NecordRestOptionsFactory>;
	useFactory?: (...args: any[]) => Promise<NecordRestModuleOptions> | NecordRestModuleOptions;
	inject?: any[];
}
