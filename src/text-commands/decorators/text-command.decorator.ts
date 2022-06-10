import { TextCommandDiscovery, TextCommandMeta } from '../text-command.discovery';
import { TEXT_COMMAND_METADATA } from '../../necord.constants';
import { SetMetadata } from '@nestjs/common';

export const TextCommand = (options: TextCommandMeta): MethodDecorator =>
	SetMetadata<string, TextCommandDiscovery>(
		TEXT_COMMAND_METADATA,
		new TextCommandDiscovery(options)
	);
