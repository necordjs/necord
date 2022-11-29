import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NecordExecutionContext } from '../../context';

// TODO: Remove in v6
/**
 *  @deprecated since v5.4 - old name for `@SelectedStrings`. Will be removed in v6. Discord now uses new select menus
 *  @see {@link https://discord.js.org/#/docs/discord.js/main/class/SelectMenuInteraction DiscordJS docs}
 *  @see {@link https://discord.com/developers/docs/interactions/message-components#select-menus Discord API docs}
 *  @see {@link https://discord.com/developers/docs/interactions/message-components#component-object-component-types ComponentType}
 */
export const Values = createParamDecorator((_, ctx: ExecutionContext) => {
	const necordContext = NecordExecutionContext.create(ctx);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	return interaction.isStringSelectMenu() ? interaction.values : [];
});
