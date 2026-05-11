import { Provider } from '@nestjs/common';
import { Client } from 'discord.js';

import { NECORD_MODULE_OPTIONS } from '../necord.module-definition';
import { NecordModuleOptions } from '../necord-options.interface';

export const ClientProvider: Provider<Client> = {
	provide: Client,
	useFactory: (options: NecordModuleOptions) => new Client(options),
	inject: [NECORD_MODULE_OPTIONS]
};
