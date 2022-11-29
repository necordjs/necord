import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NecordExecutionContext } from '../../context';

/**
 * @deprecate since v5.4 - old name for `@SelectedStrings`. Will be removed in v6
 * TODO: Remove in v6
 */
export const Values = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	return interaction.isStringSelectMenu() ? interaction.values : [];
});
