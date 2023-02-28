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
	.setExtras({})
	.build();
export const LISTENERS_METADATA = 'necord:listeners_meta';
export const TEXT_COMMAND_METADATA = 'necord:text_command_meta';
export const CONTEXT_MENU_METADATA = 'necord:context_menu_meta';
export const SLASH_COMMAND_METADATA = 'necord:slash_command_meta';
export const SUBCOMMAND_METADATA = 'necord:slash_subcommand_meta';
export const SUBCOMMAND_GROUP_METADATA = 'necord:subcommand_group_meta';
export const MESSAGE_COMPONENT_METADATA = 'necord:message_component_meta';
export const MODAL_METADATA = 'necord:modal_meta';

export const OPTIONS_METADATA = 'necord:options_meta';
export const GUILDS_METADATA = 'necord:guilds_meta';
