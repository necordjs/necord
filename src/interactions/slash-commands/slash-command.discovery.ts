import { ChatInputApplicationCommandData, CommandInteraction, Snowflake } from 'discord.js';
import { AUTOCOMPLETE_METADATA, AutocompleteMeta } from './autocompletes';
import { OptionMeta } from './options';
import { DiscoveryType, MethodDiscoveryMixin } from '../../common';
import { GUILDS_METADATA, OPTIONS_METADATA, SLASH_GROUP_METADATA } from '../../necord.constants';
import { InteractionDiscovery } from '../interaction.discovery';
import { mix } from 'ts-mixer';

export type SlashCommandMeta = ChatInputApplicationCommandData;

export interface SlashCommandDiscovery extends MethodDiscoveryMixin<SlashCommandMeta> {}

@mix(MethodDiscoveryMixin)
export class SlashCommandDiscovery extends InteractionDiscovery {
	protected override type = DiscoveryType.SLASH_COMMAND;

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

	public getGuilds(): Set<Snowflake> {
		return new Set(
			this.reflector.getAllAndMerge(GUILDS_METADATA, [this.getHandler(), this.getClass()])
		);
	}

	public getAutocomplete(): AutocompleteMeta {
		return this.reflector.get(AUTOCOMPLETE_METADATA, this.getHandler()) ?? [];
	}

	public getOptions(): Record<string, OptionMeta> {
		return this.reflector.get(OPTIONS_METADATA, this.getHandler()) ?? {};
	}

	public execute(interaction: CommandInteraction): any {
		return this._execute([interaction], transformOptions(interaction, this.getOptions()), this);
	}

	public toJSON() {
		return {
			...this.meta,
			options: Object.values(this.getOptions()).sort((a, b) => {
				if (b.index === a.index) return 0;
				if (a.index === undefined) return 1;
				if (b.index === undefined) return -1;

				return a.index - b.index;
			})
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
