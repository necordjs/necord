import { ModuleMetadata, Type } from '@nestjs/common';
import { Message } from 'discord.js';

type PrefixByMessageFn = (message: Message) => string | Promise<string>;

export interface NecordTextCommandsOptions {
	prefix: string | PrefixByMessageFn;
}

export interface NecordTextCommandsOptionsFactory {
	createNecordTextCommandsOptions():
		| Promise<NecordTextCommandsOptions>
		| NecordTextCommandsOptions;
}

export interface NecordTextCommandsAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	useExisting?: Type<NecordTextCommandsOptionsFactory>;
	useClass?: Type<NecordTextCommandsOptionsFactory>;
	useFactory?: (...args: any[]) => Promise<NecordTextCommandsOptions> | NecordTextCommandsOptions;
	inject?: any[];
}
