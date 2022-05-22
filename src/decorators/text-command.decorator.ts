import { SetMetadata } from '@nestjs/common';
import { TEXT_COMMAND_METADATA } from '../necord.constants';
import { TextCommandMeta } from '../discovery';

export const TextCommand = (options: TextCommandMeta) =>
	SetMetadata<string, TextCommandMeta>(TEXT_COMMAND_METADATA, options);
