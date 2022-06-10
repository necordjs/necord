import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	AutocompleteInteraction,
	CommandInteraction,
	CommandInteractionOptionResolver,
	PermissionsBitField,
	Snowflake
} from 'discord.js';
import { GUILDS_METADATA, OPTIONS_METADATA } from '../../necord.constants';
import { APIApplicationCommandOptionBase } from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base';
import { LocalizationMap } from 'discord-api-types/v10';
import { BaseApplicationCommandMeta, CommandDiscovery } from '../command.discovery';

export interface SlashCommandMeta extends BaseApplicationCommandMeta {
	type:
		| ApplicationCommandType.ChatInput
		| ApplicationCommandOptionType.SubcommandGroup
		| ApplicationCommandOptionType.Subcommand;
	description: string;
	description_localizations?: LocalizationMap;
}

export interface OptionMeta extends APIApplicationCommandOptionBase<any> {
	resolver?: keyof CommandInteractionOptionResolver;
}

export class SlashCommandDiscovery extends CommandDiscovery<SlashCommandMeta> {
	private readonly subcommands = new Map<string, SlashCommandDiscovery>();

	public getName() {
		return this.meta.name;
	}

	public getDescription() {
		return this.meta.description;
	}

	public getGuilds(): Set<Snowflake> {
		return new Set(
			this.reflector.getAllAndMerge(GUILDS_METADATA, [this.getHandler(), this.getClass()])
		);
	}

	public getRawOptions(): Record<string, OptionMeta> {
		return this.reflector.get(OPTIONS_METADATA, this.getHandler()) ?? {};
	}

	public getOptions(): OptionMeta[] {
		if (this.subcommands.size >= 1) {
			return [...this.subcommands.values()].map(subcommand => subcommand.toJSON());
		}

		return Object.values(this.getRawOptions());
	}

	public execute(interaction: CommandInteraction | AutocompleteInteraction): any {
		return super.execute([interaction]);
	}

	public isSlashCommand(): this is SlashCommandDiscovery {
		return true;
	}

	public override toJSON() {
		return {
			...this.meta,
			default_member_permissions: new PermissionsBitField(
				this.meta.default_member_permissions
			).bitfield.toString(),
			options: this.getOptions()
		};
	}
}
