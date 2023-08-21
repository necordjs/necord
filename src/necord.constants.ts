import { ConfigurableModuleBuilder } from '@nestjs/common';
import { NecordModuleOptions } from './necord-options.interface';

export const {
	ConfigurableModuleClass,
	MODULE_OPTIONS_TOKEN: NECORD_MODULE_OPTIONS,
	OPTIONS_TYPE,
	ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<NecordModuleOptions>()
	.setClassMethodName('forRoot')
	.setFactoryMethodName('createNecordOptions')
	.build();
