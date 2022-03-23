import { ChatInputApplicationCommandData, CommandInteraction } from 'discord.js';
import { NecordMethodDiscovery, NecordMethodDiscoveryType } from '../../context';
import { AUTOCOMPLETE_METADATA } from './autocompletes';
import { OPTIONS_METADATA, SLASH_GROUP_METADATA } from '../commands.constants';
import { DiscoveredMethodWithMeta } from '@golevelup/nestjs-discovery';
import { OptionMeta } from './decorators';

export type SlashCommandMeta = ChatInputApplicationCommandData;

export class SlashCommandDiscovery extends NecordMethodDiscovery<SlashCommandMeta> {
	protected type = NecordMethodDiscoveryType.SLASH_COMMAND;

	public constructor(discovery: DiscoveredMethodWithMeta<SlashCommandMeta>) {
		super(discovery);
	}

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
		return this.reflector.get(AUTOCOMPLETE_METADATA, this.getHandler());
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
		acc[parameter] = interaction.options[option.methodName].call(
			interaction.options,
			option.name,
			!!option.required
		);
		return acc;
	}, {});
}
