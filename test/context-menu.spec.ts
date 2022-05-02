import { Injectable } from '@nestjs/common';
import {
	Ctx,
	MessageCommand,
	MessageCommandContext,
	Opts,
	UserCommand,
	UserCommandContext
} from '../src';
import { createApplication } from './utils.spec';
import { EmbedBuilder, Message, User } from 'discord.js';

@Injectable()
export class ContextMenuSpec {
	@UserCommand('Get user avatar')
	public getUserAvatar(@Ctx() [interaction]: UserCommandContext, @Opts('user') user: User) {
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`Avatar ${user.username}`)
					.setImage(user.displayAvatarURL({ size: 4096 }))
			]
		});
	}

	@MessageCommand('Copy message content')
	public copyMessageContent(
		@Ctx() [interaction]: MessageCommandContext,
		@Opts('message') msg: Message
	) {
		return interaction.reply({ content: msg.content });
	}
}

const bootstrap = async () => {
	const app = await createApplication(ContextMenuSpec);
};

bootstrap();
