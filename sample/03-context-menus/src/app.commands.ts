import { Injectable } from '@nestjs/common';
import { Context, MessageCommand, MessageOption, SlashCommand, StringOption, UserCommand, UserOption } from 'necord';
import { CommandInteraction, ContextMenuInteraction, Message, MessageEmbed, User } from 'discord.js';

@Injectable()
export class AppCommands {
	@MessageCommand('Get message id')
	public async getMessageId(
		@Context() interaction: ContextMenuInteraction,
		@MessageOption({
			name: 'message',
			description: 'Getting message Id'
		})
		message: Message
	) {
		return interaction.reply({ content: `Message ID is ${message.id}` });
	}

	@UserCommand('Get user avatar')
	public async getUserAvatar(
		@Context() interaction: ContextMenuInteraction,
		@UserOption({
			name: 'user',
			description: 'Getting user avatar'
		})
		user: User
	) {
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle(`Avatar ${user.username}`)
					.setImage(user.displayAvatarURL({ size: 4096, dynamic: true }))
			]
		});
	}
}
