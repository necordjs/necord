import { SetMetadata } from '@nestjs/common';
import { TEXT_COMMAND_METADATA } from './text-commands.constants';
import { TextCommandMeta } from './text-command.discovery';

export const TextCommand = (name: string) =>
	SetMetadata<string, TextCommandMeta>(TEXT_COMMAND_METADATA, {
		name
	});
