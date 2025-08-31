import { createParamDecorator } from '@nestjs/common';
import { NecordExecutionContext } from '../../../context';

/**
 * Decorator that injects the target message of a message context menu command.
 * @see TargetUser
 * @see TargetMember
 * @see MessageCommand
 * @returns The target message.
 * @example
 * ```ts
 * @MessageCommand({ name: 'quote', type: 'MESSAGE' })
 * public async quote(@TargetMessage() message: Message) {
 * 	message.reply('Quoting...');
 * }
 * ```
 */
export const TargetMessage = createParamDecorator((_, context) => {
	const necordContext = NecordExecutionContext.create(context);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (!interaction.isMessageContextMenuCommand()) return null;

	return interaction.targetMessage;
});

/**
 * Decorator that injects the target user of a user context menu command.
 * @see TargetMessage
 * @see TargetMember
 * @see UserCommand
 * @returns The target user.
 * @example
 * ```ts
 * @UserCommand({ name: 'kick', type: 'USER' })
 * public async avatar(@TargetUser() user: User) {
 *  user.avatarURL();
 * }
 * ```
 */
export const TargetUser = createParamDecorator((_, context) => {
	const necordContext = NecordExecutionContext.create(context);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (!interaction.isUserContextMenuCommand()) return null;

	return interaction.targetUser;
});

/**
 * Decorator that injects the target member of a user context menu command.
 * @see TargetMessage
 * @see TargetUser
 * @see UserCommand
 * @returns The target member.
 * @example
 * ```ts
 * @UserCommand({ name: 'ban', type: 'USER' })
 * public async ban(@TargetMember() member: GuildMember) {
 *    member.ban();
 * }
 * ```
 */
export const TargetMember = createParamDecorator((_, context) => {
	const necordContext = NecordExecutionContext.create(context);
	const [interaction] = necordContext.getContext<'interactionCreate'>();

	if (!interaction.isUserContextMenuCommand()) return null;

	return interaction.targetMember;
});
