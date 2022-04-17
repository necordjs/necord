import { SetMetadata } from '@nestjs/common';
import { TextCommandMeta } from './text-command.discovery';

export const TEXT_COMMAND_METADATA = 'necord:text_command_meta';

export const TextCommand = (name: string, description: string) =>
	SetMetadata<string, TextCommandMeta>(TEXT_COMMAND_METADATA, {
		name,
		description
	});
