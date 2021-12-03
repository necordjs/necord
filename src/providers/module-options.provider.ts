import { Provider } from '@nestjs/common';
import { NecordModuleOptions } from '../interfaces';

export const MODULE_OPTIONS = 'necord:module_options';

export const createNecordModuleOptionsProvider = (options: NecordModuleOptions): Provider<NecordModuleOptions> => ({
	provide: MODULE_OPTIONS,
	useValue: options
});
