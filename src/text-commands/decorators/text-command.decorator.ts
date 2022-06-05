import { TextCommandMeta } from '../text-command.discovery';
import { SetMetadata } from '@nestjs/common';
import { TEXT_COMMAND_METADATA } from '../../necord.constants';

export const TextCommand = (options: TextCommandMeta): MethodDecorator =>
	SetMetadata<string, TextCommandMeta>(TEXT_COMMAND_METADATA, options);
