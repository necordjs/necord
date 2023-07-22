import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	AutocompleteInteraction,
	ChatInputApplicationCommandData,
	ChatInputCommandInteraction,
	Collection,
	CommandInteractionOptionResolver,
	Snowflake
} from 'discord.js';
import { OPTIONS_METADATA } from '../../necord.constants';
import { APIApplicationCommandOptionBase } from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base';
import { CommandDiscovery } from '../command.discovery';

// TODO: Separate to SlashCommandDiscovery, SubcommandGroupDiscovery, SubcommandDiscovery
// @ts-ignore
export interface SlashCommandMeta extends ChatInputApplicationCommandData {
	type?:
		| ApplicationCommandType.ChatInput
		| ApplicationCommandOptionType.SubcommandGroup
		| ApplicationCommandOptionType.Subcommand;
	guilds?: Snowflake[];
}

export interface OptionMeta extends APIApplicationCommandOptionBase<any> {
	resolver?: keyof CommandInteractionOptionResolver;
}

export class SlashCommandDiscovery extends CommandDiscovery<SlashCommandMeta> {
	private readonly subcommands = new Collection<string, SlashCommandDiscovery>();

	public getDescription() {
		return this.meta.description;
	}

	public setSubcommand(command: SlashCommandDiscovery) {
		this.subcommands.set(command.getName(), command);
	}

	public getRawOptions(): Record<string, OptionMeta> {
		return this.reflector.get(OPTIONS_METADATA, this.getHandler()) ?? {};
	}

	public getOptions() {
		if (this.subcommands.size >= 1) {
			return [...this.subcommands.values()].map(subcommand => subcommand.toJSON());
		}

		return Object.values(this.getRawOptions());
	}

	public execute(
		interaction: ChatInputCommandInteraction | AutocompleteInteraction,
		depth = 1
	): any {
		if (this.subcommands.size >= 1) {
			const commandName =
				depth === 2
					? interaction.options.getSubcommand(true)
					: interaction.options.getSubcommandGroup(false) ??
					  interaction.options.getSubcommand(true);

			return this.subcommands.get(commandName)?.execute(interaction, depth + 1);
		}

		return super.execute([interaction]);
	}

	public isSlashCommand(): this is SlashCommandDiscovery {
		return true;
	}

	public override toJSON() {
		return {
			...this.meta,
			options: this.getOptions()
		};
	}
}
