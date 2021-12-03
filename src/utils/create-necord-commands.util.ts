import { ApplicationCommandData } from 'discord.js';
import { SetMetadata } from '@nestjs/common';
import { APPLICATION_COMMAND_METADATA } from '../necord.constants';

export function createNecordCommandDecorator<
	T extends ApplicationCommandData['type'],
	C extends ApplicationCommandData & { type: T }
>(type: T): (options: Omit<C, 'type' | 'options'>) => MethodDecorator {
	return (options: C) => SetMetadata<string, C>(APPLICATION_COMMAND_METADATA, { type, ...options });
}
