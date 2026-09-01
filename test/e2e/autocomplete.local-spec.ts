import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import { Injectable, UseInterceptors } from '@nestjs/common';

import { AutocompleteInterceptor, Ctx, Opts, SlashCommand } from '../../src/index.js';
import { createApplication } from './utils.local-spec.js';
import { Style, ThemeDto } from './dto/theme.dto.js';

@Injectable()
class ThemeAutocompleteInterceptor extends AutocompleteInterceptor {
	public transformOptions(interaction: AutocompleteInteraction) {
		const focused = interaction.options.getFocused(true);
		let choices: string[] = [];

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
export class AutocompleteLocalSpec {
	@SlashCommand({ name: 'theme', description: 'Select new theme style' })
	@UseInterceptors(ThemeAutocompleteInterceptor)
	public theme(@Ctx() [interaction]: [CommandInteraction], @Opts() { style }: ThemeDto) {
		return interaction.reply({
			content: `You selected **${style}** style`
		});
	}
}

createApplication(AutocompleteLocalSpec);
