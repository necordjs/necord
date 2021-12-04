import { Injectable, Logger } from '@nestjs/common';
import { Button, Context, NecordClient, On, SelectMenu } from 'necord';
import {
	ButtonInteraction,
	Client,
	Message,
	MessageActionRow,
	MessageButton,
	MessageSelectMenu,
	SelectMenuInteraction
} from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';

@Injectable()
export class AppUpdate {
	private readonly logger = new Logger(AppUpdate.name);

	public constructor(private readonly necordClient: NecordClient) {}

	@On('ready')
	public async onReady(@Context() client: Client) {
		this.logger.log(`Bot logged in as ${client.user.username}`);
	}

	@On('messageCreate')
	public async onMessageCreate(@Context() message: Message) {
		if (message.author.bot || message.author.id === this.necordClient.user.id) return;

		this.logger.log(`New message from ${message.author.username}`);

		if (message.content.startsWith('!ping')) {
			return message.reply('Pong!');
		}

		if (message.content.startsWith('!test')) {
			return message.reply({
				content: 'Test buttons and select menus',
				components: [
					new MessageActionRow().addComponents(
						new MessageButton()
							.setCustomId('button_test')
							.setLabel('Test button')
							.setStyle(MessageButtonStyles.PRIMARY),
						new MessageButton()
							.setURL('https://github.com/SocketSomeone/necord/wiki')
							.setLabel('Documentation')
							.setStyle(MessageButtonStyles.LINK)
					),
					new MessageActionRow().addComponents(
						new MessageSelectMenu()
							.setCustomId('select_test')
							.setPlaceholder('Values')
							.setMinValues(1)
							.setMaxValues(3)
							.addOptions([
								{ label: 'Red', value: '🟥' },
								{ label: 'Blue', value: '🟦' },
								{ label: 'Yellow', value: '🟨' }
							])
					)
				]
			});
		}
	}

	@Button('button_test')
	public async onButton(@Context() interaction: ButtonInteraction) {
		return interaction.reply({ content: 'Button was clicked!' });
	}

	@SelectMenu('select_test')
	public async onSelect(@Context() interaction: SelectMenuInteraction) {
		return interaction.reply({ content: `You selected values: ${interaction.values.join(' ')}` });
	}
}
