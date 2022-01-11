import * as assert from 'node:assert';
import { Injectable } from '@nestjs/common';
import { Ctx, MessageCommand, NecordRegistry, Opts, UserCommand } from '../src';
import { createApplication, DevGuild } from './utils.spec';
import { ContextMenuInteraction, Message, MessageEmbed, User } from 'discord.js';

@DevGuild
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
	const registry = app.get(NecordRegistry);

	assert.notStrictEqual(registry.getContextMenu('USER', 'Get user avatar'), undefined);
	assert.notStrictEqual(registry.getContextMenu('MESSAGE', 'Copy message content'), undefined);
	assert.strictEqual(registry.getApplicationCommands().length, 2);
};

bootstrap();
