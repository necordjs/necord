import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NecordExecutionContext } from '../../context';

export const Values = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	return interaction.isAnySelectMenu() ? interaction.values : [];
});
