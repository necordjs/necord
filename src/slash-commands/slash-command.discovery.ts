import { mix } from 'ts-mixer';
import {
	ApplicationCommandSubCommandData,
	AutocompleteInteraction,
	ChatInputApplicationCommandData,
	CommandInteraction,
	CommandInteractionOptionResolver,
	PermissionsBitField,
	Snowflake
} from 'discord.js';
import {
	DM_PERMISSIONS_METADATA,
	GUILDS_METADATA,
	MEMBER_PERMISSIONS_METADATA,
	OPTIONS_METADATA
} from '../necord.constants';
import {
	BaseDiscovery,
	ClassDiscoveryMixin,
	CommandDiscovery,
	MethodDiscoveryMixin
} from '../discovery';
import { APIApplicationCommandOptionBase } from 'discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base';

export type SlashCommandMeta = ChatInputApplicationCommandData;

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

	public getDmPermissions(): boolean {
		return this.reflector.getAllAndOverride(DM_PERMISSIONS_METADATA, [
			this.getHandler(),
			this.getClass()
		]);
	}

	public getMemberPermissions(): PermissionsBitField {
		return this.reflector.getAllAndOverride(MEMBER_PERMISSIONS_METADATA, [
			this.getHandler(),
			this.getClass()
		]);
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
			default_member_permissions: this.getMemberPermissions()?.valueOf().toString(),
			dm_permission: this.getDmPermissions(),
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

	public getDmPermissions(): boolean {
		return this.reflector.get(DM_PERMISSIONS_METADATA, this.getClass());
	}

	public getMemberPermissions(): PermissionsBitField {
		return this.reflector.get(MEMBER_PERMISSIONS_METADATA, this.getClass());
	}

	public override toJSON(): Record<string, any> {
		return {
			...this.meta,
			default_member_permissions: this.getMemberPermissions()?.valueOf().toString(),
			dm_permission: this.getDmPermissions()
		};
	}
}

export interface SlashCommandSubGroupDiscovery
	extends MethodDiscoveryMixin<ApplicationCommandSubCommandData> {}

@mix(MethodDiscoveryMixin)
export class SlashCommandSubGroupDiscovery extends BaseDiscovery {
	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
