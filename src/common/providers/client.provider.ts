import { Provider } from '@nestjs/common';
import { Client } from 'discord.js';
import { NECORD_MODULE_OPTIONS, NecordModuleOptions } from '../../necord-options';

export const clientProvider: Provider<Client> = {
	provide: Client,
	useFactory: (options: NecordModuleOptions) => new Client(options),
	inject: [NECORD_MODULE_OPTIONS]
};
