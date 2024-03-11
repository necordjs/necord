import { TextCommandDiscovery, TextCommandMeta } from '../text-command.discovery';
import { Reflector } from '@nestjs/core';

/**
 * Decorator that marks a method as a text command for discord.js client.
 * @param options The options for the text command.
 * @url https://necord.org/text-commands
 */
export const TextCommand = Reflector.createDecorator<TextCommandMeta, TextCommandDiscovery>({
	transform: (options: TextCommandMeta) => new TextCommandDiscovery(options)
});
