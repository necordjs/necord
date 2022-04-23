import { SetMetadata } from '@nestjs/common';
import { TEXT_COMMAND_METADATA } from '../necord.constants';
import { TextCommandMeta } from '../discovery';

export const TextCommand = (name: string, description: string) =>
	SetMetadata<string, TextCommandMeta>(TEXT_COMMAND_METADATA, {
		name,
		description
	});
