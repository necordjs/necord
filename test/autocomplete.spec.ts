import * as assert from 'node:assert';
import { Injectable } from '@nestjs/common';
import { CommandInteraction } from 'discord.js';
import { Autocomplete, Ctx, NecordRegistry, Opts, SlashCommand, TransformOptions } from '../src';
import { createApplication } from './utils.spec';
import { Style, ThemeDto } from './dto/theme.dto';
import { AUTOCOMPLETE_METADATA } from '../src/necord.constants';

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
	@SlashCommand('theme', 'Select new theme style')
	public theme(@Ctx() [interaction]: [CommandInteraction], @Opts() { style }: ThemeDto) {
		return interaction.reply({
			content: `You selected **${style}** style`
		});
	}
}

const bootstrap = async () => {
	const app = await createApplication(AutocompleteSpec);
	const registry = app.get(NecordRegistry);

	const command = registry.getSlashCommand('theme');

	assert.notStrictEqual(command, undefined);
	assert.strictEqual(registry.getApplicationCommands().length, 1);
	assert.strictEqual(command.metadata[AUTOCOMPLETE_METADATA], ThemeAutocomplete);
};

bootstrap();
