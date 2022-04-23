import { SetMetadata } from '@nestjs/common';
import { TextCommandMeta } from './text-command.discovery';
import { TEXT_COMMAND_METADATA } from '../necord.constants';

export const TextCommand = (name: string, description: string) =>
	SetMetadata<string, TextCommandMeta>(TEXT_COMMAND_METADATA, {
		name,
		description
	});
