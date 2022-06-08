import { Injectable } from '@nestjs/common';
import {
	Ctx,
	MessageCommand,
	MessageCommandContext,
	UserCommand,
	UserCommandContext
} from '../src';
import { createApplication } from './utils.spec';
import { EmbedBuilder } from 'discord.js';

@Injectable()
export class ContextMenuSpec {
	@UserCommand({ name: 'Get user avatar' })
	public getUserAvatar(@Ctx() [interaction]: UserCommandContext) {
		const user = interaction.options.getUser('user');

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle(`Avatar ${user.username}`)
					.setImage(user.displayAvatarURL({ size: 4096 }))
			]
		});
	}

	@MessageCommand({ name: 'Copy message content' })
	public copyMessageContent(@Ctx() [interaction]: MessageCommandContext) {
		const msg = interaction.options.getMessage('message');

		return interaction.reply({ content: msg.content });
	}
}

createApplication(ContextMenuSpec);
