import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NecordExecutionContext, TextCommandContext } from '../../context';

/**
 * Represents an arguments param decorator.
 * @url https://necord.org/text-commands
 * @returns The arguments param decorator.
 * @url https://necord.org/text-commands#arguments
 */
export const Arguments = createParamDecorator((_, context: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(context);
	const [message] = necordContext.getContext<TextCommandContext>();
	const discovery = necordContext.getDiscovery();

	if (!discovery.isTextCommand()) return null;

	return message.content.split(/ +/g).slice(1);
});

export const Args = Arguments;
