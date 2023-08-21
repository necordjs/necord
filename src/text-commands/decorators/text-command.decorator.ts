import { TextCommandDiscovery, TextCommandMeta } from '../text-command.discovery';
import { Reflector } from '@nestjs/core';

export const TextCommand = Reflector.createDecorator<TextCommandMeta>({
	transform: (options: TextCommandMeta) => new TextCommandDiscovery(options)
});
