import { Injectable } from '@nestjs/common';
import { Context, SlashCommand } from 'necord';
import { CommandInteraction, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';

@Injectable()
export class AppCommands {
	@SlashCommand({ name: 'button', description: 'Creates button component.' })
	public async createButton(@Context() interaction: CommandInteraction) {
		return interaction.reply({
			content: `Button`,
			components: [
				new MessageActionRow().addComponents(
					new MessageButton().setCustomId('BUTTON').setLabel('LABEL').setStyle(MessageButtonStyles.PRIMARY)
				)
			]
		});
	}

	@SlashCommand({ name: 'select-menu', description: 'Creates select menu component.' })
	public async createSelectMenu(@Context() interaction: CommandInteraction) {
		return interaction.reply({
			content: `Button`,
			components: [
				new MessageActionRow().addComponents(
					new MessageSelectMenu()
						.setCustomId('SELECT_MENU')
						.setPlaceholder('Select your color')
						.setMaxValues(1)
						.setMinValues(1)
						.setOptions([
							{ label: 'Red', value: 'Red' },
							{ label: 'Blue', value: 'Blue' },
							{ label: 'Yellow', value: 'Yellow' }
						])
				)
			]
		});
	}
}
