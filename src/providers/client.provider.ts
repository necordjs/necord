import { Provider } from '@nestjs/common';
import { Client } from 'discord.js';
import { NecordModuleOptions } from '../interfaces';
import { NECORD_MODULE_OPTIONS } from '../necord.constants';

export const ClientProvider: Provider<Client> = {
	provide: Client,
	useFactory: (options: NecordModuleOptions) => new Client(options),
	inject: [NECORD_MODULE_OPTIONS]
};
