import { Injectable } from '@nestjs/common';
import { Ctx, Modal, ModalContext, SlashCommand, SlashCommandContext } from '../src';
import { createApplication } from './utils.spec';
import {
	ActionRowBuilder,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';

@Injectable()
export class ContextMenuSpec {
	@Modal('pizza')
	public yourFavPizza(@Ctx() [interaction]: ModalContext) {
		return interaction.reply({
			content: `Your fav pizza - ${interaction.fields.getTextInputValue('pizza')}`
		});
	}

	@SlashCommand('modal', 'test modal')
	public showModal(@Ctx() [interaction]: SlashCommandContext) {
		return interaction.showModal(
			new ModalBuilder()
				.setTitle('What your fav pizza?')
				.setCustomId('pizza')
				.setComponents([
					new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents([
						new TextInputBuilder()
							.setCustomId('pizza')
							.setLabel('???')
							.setStyle(TextInputStyle.Paragraph)
					])
				])
		);
	}
}

createApplication(ContextMenuSpec);
