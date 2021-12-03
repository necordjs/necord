import { Provider } from '@nestjs/common';
import { BaseMessageComponent } from 'discord.js';

export const MESSAGE_COMPONENTS = 'necord:message_components';

// TODO: Get components by custom id
export const messageComponentsProvider: Provider<Map<string, BaseMessageComponent>> = {
	provide: MESSAGE_COMPONENTS,
	useValue: new Map<string, BaseMessageComponent>()
};
