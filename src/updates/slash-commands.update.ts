import { Injectable } from '@nestjs/common';
import { ContextOf, SlashCommandMetadata } from '../interfaces';
import { Context, On } from '../decorators';
import { OPTIONS_METADATA } from '../necord.constants';
import { CommandInteraction } from 'discord.js';
import { NecordRegistry } from '../necord-registry';

@Injectable()
export class SlashCommandsUpdate {
	public constructor(private readonly registry: NecordRegistry) {}

	@On('interactionCreate')
	private onInteractionCreate(@Context() [interaction]: ContextOf<'interactionCreate'>) {
		if (!interaction.isCommand()) return;

		const rootCommand = interaction.commandName;
		const groupCommand = interaction.options.getSubcommandGroup(false);
		const subCommand = interaction.options.getSubcommand(false);

		const command = this.registry.getSlashCommand(
			...[rootCommand, groupCommand, subCommand].filter(Boolean)
		);

		if (!command) return;

		return command.metadata.execute([interaction], this.transformOptions(command, interaction));
	}

	private transformOptions(command: SlashCommandMetadata, interaction: CommandInteraction) {
		const rawOptions = command.metadata[OPTIONS_METADATA] ?? {};
		return Object.entries(rawOptions).reduce((acc, [parameter, option]) => {
			acc[parameter] = interaction.options[option.methodName].call(
				interaction.options,
				option.name,
				!!option.required
			);
			return acc;
		}, {});
	}
}
