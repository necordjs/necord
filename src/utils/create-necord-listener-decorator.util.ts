import 'reflect-metadata';
import { SetMetadata } from '@nestjs/common';
import { LISTENERS_METADATA } from '../necord.constants';
import { ListenerMetadata } from '../interfaces';

export const createNecordListener = (options: Omit<ListenerMetadata, 'execute' | 'methodName'>) =>
	SetMetadata(LISTENERS_METADATA, options);
