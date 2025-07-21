import { Injectable } from '@nestjs/common';
import { Ctx, Modal, ModalContext, ModalParam, SlashCommand, SlashCommandContext } from '../../src';
import { createApplication } from './utils.local-spec';
import {
	ActionRowBuilder,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';

@Injectable()
export class ContextMenuSpec {
	@Modal('pizza/:value')
	public yourFavPizza(@Ctx() [interaction]: ModalContext, @ModalParam('value') value: string) {
		return interaction.reply({
			content: `Your fav pizza${value} - ${interaction.fields.getTextInputValue('pizza')}`
		});
	}

	@SlashCommand({ name: 'modal', description: 'test modal' })
	public showModal(@Ctx() [interaction]: SlashCommandContext) {
		return interaction.showModal(
			new ModalBuilder()
				.setTitle('What your fav pizza?')
				.setCustomId('pizza/12345')
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
