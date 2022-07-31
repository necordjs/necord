import {
	Button,
	ButtonContext,
	ComponentParam,
	Context,
	SelectMenu,
	SelectMenuContext,
	SlashCommand,
	SlashCommandContext
} from '../src';
import { Injectable } from '@nestjs/common';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } from 'discord.js';
import { MessageActionRowComponentBuilder } from '@discordjs/builders';
import { createApplication } from './utils.spec';

@Injectable()
export class MessageComponentsSpec {
	@SlashCommand({ name: 'button', description: 'Creates button component.' })
	public async createButton(@Context() [interaction]: SlashCommandContext) {
		return interaction.reply({
			content: `Button`,
			components: [
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
					new ButtonBuilder()
						.setCustomId('click/12345')
						.setLabel('LABEL')
						.setStyle(ButtonStyle.Primary)
				])
			]
		});
	}

	@SlashCommand({ name: 'select-menu', description: 'Creates select menu component.' })
	public async createSelectMenu(@Context() [interaction]: SlashCommandContext) {
		return interaction.reply({
			content: `Select Menu`,
			components: [
				new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
					new SelectMenuBuilder()
						.setCustomId('SELECT_MENU')
						.setPlaceholder('Select your color')
						.setMaxValues(1)
						.setMinValues(1)
						.setOptions([
							{ label: 'Red', value: 'Red' },
							{ label: 'Blue', value: 'Blue' },
							{ label: 'Yellow', value: 'Yellow' }
						])
				])
			]
		});
	}

	@Button('click/:value')
	public onButton(
		@Context() [interaction]: ButtonContext,
		@ComponentParam('value') value: string
	) {
		return interaction.reply({ content: `Button clicked! Value: ${value}` });
	}

	@SelectMenu('SELECT_MENU')
	public onSelectMenu(@Context() [interaction]: SelectMenuContext) {
		return interaction.reply({
			content: `Your selected color - ${interaction.values.join(' ')}`
		});
	}
}

createApplication(MessageComponentsSpec);
