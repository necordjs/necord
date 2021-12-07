import { Injectable } from '@nestjs/common';
import { Button, Context, SelectMenu, Values } from 'necord';
import { ButtonInteraction, SelectMenuInteraction } from 'discord.js';

@Injectable()
export class AppComponents {
	@Button('BUTTON')
	public onButton(@Context() interaction: ButtonInteraction) {
		return interaction.reply({ content: 'Button clicked!' });
	}

	@SelectMenu('SELECT_MENU')
	public onSelectMenu(@Context() interaction: SelectMenuInteraction, @Values() values: string[]) {
		return interaction.reply({ content: `Your selected color - ${values.join(' ')}` });
	}
}
