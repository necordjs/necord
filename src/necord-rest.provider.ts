import { Provider } from '@nestjs/common';
import { REST } from 'discord.js';
import { NecordModuleOptions } from './necord-options.interface';
import { NECORD_MODULE_OPTIONS } from './necord.module-definition';

export const NecordRestProvider: Provider<REST> = {
	provide: REST,
	useFactory: (options: NecordModuleOptions) => new REST(options.rest).setToken(options.token),
	inject: [NECORD_MODULE_OPTIONS]
};
