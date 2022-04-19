import { ModuleMetadata, Type } from '@nestjs/common';
import { ClientOptions as DiscordClientOptions, Snowflake } from 'discord.js';

export const NECORD_MODULE_OPTIONS = 'necord:module_options';

export interface NecordModuleOptions extends DiscordClientOptions {
	token: string;
	prefix?: string | Function;
	syncGlobal: boolean;
	syncDevelopment: Snowflake[];
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
