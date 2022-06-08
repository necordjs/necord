import { Injectable } from '@nestjs/common';
import { CommandInteraction } from 'discord.js';
import { Autocomplete, Ctx, Opts, SlashCommand, TransformOptions } from '../src';
import { createApplication } from './utils.spec';
import { Style, ThemeDto } from './dto/theme.dto';

@Injectable()
class ThemeAutocomplete implements TransformOptions {
	public transformOptions(interaction, focused) {
		let choices: string[];

		if (focused.name === 'style') {
			choices = Object.values(Style);
		}

		return choices
			.filter(choice => choice.startsWith(focused.value.toString()))
			.map(choice => ({ name: choice, value: choice }));
	}
}

@Injectable()
export class AutocompleteSpec {
	@Autocomplete(ThemeAutocomplete)
	@SlashCommand({ name: 'theme', description: 'Select new theme style' })
	public theme(@Ctx() [interaction]: [CommandInteraction], @Opts() { style }: ThemeDto) {
		return interaction.reply({
			content: `You selected **${style}** style`
		});
	}
}

createApplication(AutocompleteSpec, ThemeAutocomplete);
