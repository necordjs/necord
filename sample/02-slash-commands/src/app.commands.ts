import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, StringOption } from 'necord';
import { CommandInteraction } from 'discord.js';

@Injectable()
export class AppCommands {
	@SlashCommand('ping', 'Ping-Pong Command')
	public async onPing(@Context() interaction: CommandInteraction) {
		return interaction.reply({ content: 'Pong!' });
	}

	@SlashCommand('length', 'Get length of text')
	public async onLength(
		@Context() interaction: CommandInteraction,
		@StringOption({
			name: 'text',
			description: 'Your text',
			required: true
		})
		text: string
	) {
		return interaction.reply({ content: `Length of your text ${text.length}` });
	}
}
