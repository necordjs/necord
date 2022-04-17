import { ChatInputApplicationCommandData, CommandInteraction } from 'discord.js';
import { BaseDiscovery, DiscoveryType } from '../common';
import { AUTOCOMPLETE_METADATA } from './autocompletes';
import { SLASH_GROUP_METADATA } from './slash-commands.constants';
import { OptionMeta, OPTIONS_METADATA } from './options';

export type SlashCommandMeta = ChatInputApplicationCommandData;

export class SlashCommandDiscovery extends BaseDiscovery<SlashCommandMeta> {
	protected type = DiscoveryType.SLASH_COMMAND;

	public getName() {
		return [this.getGroup(), this.getSubGroup(), this.meta]
			.map(x => x?.name)
			.filter(Boolean)
			.join(' ')
			.toLowerCase();
	}

	public getGroup() {
		return this.reflector.get(SLASH_GROUP_METADATA, this.getClass());
	}

	public getSubGroup() {
		return this.reflector.get(SLASH_GROUP_METADATA, this.getHandler());
	}

	public getAutocomplete() {
		return this.reflector.get(AUTOCOMPLETE_METADATA, this.getHandler()) ?? [];
	}

	public getOptions(): Record<string, any> {
		return this.reflector.get(OPTIONS_METADATA, this.getHandler()) ?? {};
	}

	public override execute(interaction: CommandInteraction): any {
		return super.execute([interaction], transformOptions(interaction, this.getOptions()));
	}

	public toJSON() {
		return {
			...this.meta,
			options: Object.values(this.getOptions())
		};
	}
}

function transformOptions(interaction: CommandInteraction, rawOptions: Record<string, OptionMeta>) {
	return Object.entries(rawOptions).reduce((acc, [parameter, option]) => {
		acc[parameter] = interaction.options[option.resolver].call(
			interaction.options,
			option.name,
			!!option.required
		);
		return acc;
	}, {});
}
