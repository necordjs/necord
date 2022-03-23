import { Injectable } from '@nestjs/common';
import { Ctx, MessageCommand, Opts, UserCommand } from '../src';
import { createApplication } from './utils.spec';
import { ContextMenuInteraction, Message, MessageEmbed, User } from 'discord.js';

@Injectable()
export class ContextMenuSpec {
	@UserCommand('Get user avatar')
	public getUserAvatar(@Ctx() [interaction]: [ContextMenuInteraction], @Opts('user') user: User) {
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle(`Avatar ${user.username}`)
					.setImage(user.displayAvatarURL({ size: 4096, dynamic: true }))
			]
		});
	}

	@MessageCommand('Copy message content')
	public copyMessageContent(
		@Ctx() [interaction]: [ContextMenuInteraction],
		@Opts('message') msg: Message
	) {
		return interaction.reply({ content: msg.content });
	}
}

const bootstrap = async () => {
	const app = await createApplication(ContextMenuSpec);
};

bootstrap();
