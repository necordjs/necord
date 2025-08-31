import { Injectable } from '@nestjs/common';
import {
	Ctx,
	MessageCommand,
	MessageCommandContext,
	TargetMessage,
	TargetUser,
	UserCommand,
	UserCommandContext
} from '../../src';
import { createApplication } from './utils.local-spec';
import { EmbedBuilder, Message, User } from 'discord.js';

@Injectable()
export class ContextMenuLocalSpec {
	@UserCommand({ name: 'Get user avatar' })
	public getUserAvatar(@Ctx() [interaction]: UserCommandContext, @TargetUser() user: User) {
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`Avatar ${user.username}`)
					.setImage(user.displayAvatarURL({ size: 4096 }))
			]
		});
	}

	@MessageCommand({ name: 'Copy message content' })
	public copyMessageContent(
		@Ctx() [interaction]: MessageCommandContext,
		@TargetMessage() message: Message
	) {
		return interaction.reply({ content: message.content });
	}
}

createApplication(ContextMenuLocalSpec);
