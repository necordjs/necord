import { Provider } from '@nestjs/common';
import { NecordModuleOptions } from './necord-options.interface';
import { NECORD_MODULE_OPTIONS } from './necord.module-definition';
import { NecordClient } from './necord-client';

export const NecordClientProvider: Provider<NecordClient> = {
	provide: NecordClient,
	useFactory: (options: NecordModuleOptions) => new NecordClient(options),
	inject: [NECORD_MODULE_OPTIONS]
};
