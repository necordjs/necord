import { Injectable, UseInterceptors } from '@nestjs/common';
import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import { AutocompleteInterceptor, Ctx, Opts, SlashCommand } from '../src';
import { createApplication } from './utils.spec';
import { Style, ThemeDto } from './dto/theme.dto';

@Injectable()
class ThemeAutocompleteInterceptor extends AutocompleteInterceptor {
	public transformOptions(interaction: AutocompleteInteraction) {
		const focused = interaction.options.getFocused(true);
		let choices: string[];

		if (focused.name === 'style') {
			choices = Object.values(Style);
		}

		return interaction.respond(
			choices
				.filter(choice => choice.startsWith(focused.value.toString()))
				.map(choice => ({ name: choice, value: choice }))
		);
	}
}

@Injectable()
export class AutocompleteSpec {
	@UseInterceptors(ThemeAutocompleteInterceptor)
	@SlashCommand({ name: 'theme', description: 'Select new theme style' })
	public theme(@Ctx() [interaction]: [CommandInteraction], @Opts() { style }: ThemeDto) {
		return interaction.reply({
			content: `You selected **${style}** style`
		});
	}
}

createApplication(AutocompleteSpec);
