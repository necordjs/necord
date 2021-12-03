import { Injectable } from '@nestjs/common';
import { Context, MessageCommand, Options, UserCommand } from 'necord';
import { ContextMenuInteraction, Message, MessageEmbed, User } from 'discord.js';

@Injectable()
export class AppCommands {
	@MessageCommand({ name: 'Get message id' })
	public async getMessageId(@Context() interaction: ContextMenuInteraction, @Options('message') message: Message) {
		return interaction.reply({ content: `Message ID is ${message.id}` });
	}

	@UserCommand({ name: 'Get user avatar' })
	public async getUserAvatar(@Context() interaction: ContextMenuInteraction, @Options('user') user: User) {
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle(`Avatar ${user.username}`)
					.setImage(user.displayAvatarURL({ size: 4096, dynamic: true }))
			]
		});
	}
}
