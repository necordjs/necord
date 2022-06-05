import { Provider } from '@nestjs/common';
import { Client } from 'discord.js';
import { NecordModuleOptions } from './necord-options.interface';
import { NECORD_MODULE_OPTIONS } from './necord.constants';

export const NecordClientProvider: Provider<Client> = {
	provide: Client,
	useFactory: (options: NecordModuleOptions) => new Client(options),
	inject: [NECORD_MODULE_OPTIONS]
};
