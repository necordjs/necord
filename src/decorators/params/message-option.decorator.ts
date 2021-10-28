import { OptionMetadata } from '../../interfaces';
import { createNecordOption } from '../../utils';

export const MessageOption = (options: OptionMetadata) =>
	createNecordOption(resolver => resolver.getMessage(options.name, !!options.required));
