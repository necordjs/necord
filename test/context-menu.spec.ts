import { Injectable } from '@nestjs/common';
import {
	Ctx,
	MessageCommand,
	MessageCommandContext,
	Target,
	UserCommand,
	UserCommandContext
} from '../src';
import { createApplication } from './utils.spec';
import { EmbedBuilder, Message, User } from 'discord.js';

@Injectable()
export class ContextMenuSpec {
	@UserCommand({ name: 'Get user avatar' })
	public getUserAvatar(@Ctx() [interaction]: UserCommandContext, @Target() user: User) {
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
		@Target() message: Message
	) {
		return interaction.reply({ content: message.content });
	}
}

createApplication(ContextMenuSpec);
