import { mix } from 'ts-mixer';
import {
	ApplicationCommandOptionType,
	ApplicationCommandSubCommandData,
	ApplicationCommandType,
	AutocompleteInteraction,
	CommandInteraction,
	CommandInteractionOptionResolver,
	PermissionsBitField,
	Snowflake
} from 'discord.js';
import { GUILDS_METADATA, OPTIONS_METADATA } from '../../necord.constants';
import {
	BaseApplicationCommandMeta,
	BaseDiscovery,
	ClassDiscoveryMixin,
	CommandDiscovery,
	MethodDiscoveryMixin
} from '../../discovery';
import { APIApplicationCommandOptionBase } from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base';
import { LocalizationMap } from 'discord-api-types/v10';

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

export interface SlashCommandDiscovery extends MethodDiscoveryMixin<SlashCommandMeta> {}

@mix(MethodDiscoveryMixin)
export class SlashCommandDiscovery extends CommandDiscovery {
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
		return Object.values(this.getRawOptions());
	}

	public execute(interaction: CommandInteraction | AutocompleteInteraction): any {
		return this._execute([interaction]);
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

export interface SlashCommandGroupDiscovery
	extends ClassDiscoveryMixin<ApplicationCommandSubCommandData> {}

@mix(ClassDiscoveryMixin)
export class SlashCommandGroupDiscovery extends CommandDiscovery {
	public override getGuilds(): Set<Snowflake> {
		return new Set(this.reflector.get(GUILDS_METADATA, this.getClass()));
	}

	public isSlashCommand(): this is SlashCommandDiscovery {
		return true;
	}

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}

export interface SlashCommandSubGroupDiscovery
	extends MethodDiscoveryMixin<ApplicationCommandSubCommandData> {}

@mix(MethodDiscoveryMixin)
export class SlashCommandSubGroupDiscovery extends BaseDiscovery {
	public isSlashCommand(): this is SlashCommandDiscovery {
		return true;
	}

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
