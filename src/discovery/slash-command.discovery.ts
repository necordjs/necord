import { mix } from 'ts-mixer';
import {
	ApplicationCommandSubCommandData,
	ChatInputApplicationCommandData,
	CommandInteraction,
	Permissions,
	Snowflake
} from 'discord.js';
import {
	AUTOCOMPLETE_METADATA,
	DM_PERMISSIONS_METADATA,
	GUILDS_METADATA,
	MEMBER_PERMISSIONS_METADATA,
	OPTIONS_METADATA
} from '../necord.constants';
import {
	BaseDiscovery,
	ClassDiscoveryMixin,
	CommandDiscovery,
	DiscoveryType,
	MethodDiscoveryMixin
} from './mixins';
import { AutocompleteMeta } from '../decorators';
import { OptionMeta } from '../interfaces';

export type SlashCommandMeta = ChatInputApplicationCommandData;

export interface SlashCommandDiscovery extends MethodDiscoveryMixin<SlashCommandMeta> {}

@mix(MethodDiscoveryMixin)
export class SlashCommandDiscovery extends CommandDiscovery {
	protected override type = DiscoveryType.SLASH_COMMAND;

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

	public getMemberPermissions(): Permissions {
		return this.reflector.getAllAndOverride(MEMBER_PERMISSIONS_METADATA, [
			this.getHandler(),
			this.getClass()
		]);
	}

	public getAutocomplete(): AutocompleteMeta {
		return this.reflector.get(AUTOCOMPLETE_METADATA, this.getHandler()) ?? [];
	}

	public getRawOptions(): Record<string, OptionMeta> {
		return this.reflector.get(OPTIONS_METADATA, this.getHandler()) ?? {};
	}

	public getOptions(): OptionMeta[] {
		return Object.values(this.getRawOptions()).sort((a, b) => {
			if (b.index === a.index) return 0;
			if (a.index === undefined) return 1;
			if (b.index === undefined) return -1;

			return a.index - b.index;
		});
	}

	public execute(interaction: CommandInteraction): any {
		return this._execute([interaction], this.transformOptions(interaction));
	}

	public override toJSON() {
		return {
			...this.meta,
			default_member_permissions: this.getMemberPermissions()?.valueOf().toString(),
			dm_permission: this.getDmPermissions(),
			options: this.getOptions()
		};
	}

	private transformOptions(interaction: CommandInteraction) {
		return Object.entries(this.getRawOptions()).reduce((acc, [parameter, option]) => {
			acc[parameter] = interaction.options[option.resolver].call(
				interaction.options,
				option.name,
				!!option.required
			);
			return acc;
		}, {});
	}
}

export interface SlashCommandGroupDiscovery
	extends ClassDiscoveryMixin<ApplicationCommandSubCommandData> {}

@mix(ClassDiscoveryMixin)
export class SlashCommandGroupDiscovery extends CommandDiscovery {
	protected override type: DiscoveryType;

	public override getGuilds(): Set<Snowflake> {
		return new Set(this.reflector.get(GUILDS_METADATA, this.getClass()));
	}

	public getDmPermissions(): boolean {
		return this.reflector.get(DM_PERMISSIONS_METADATA, this.getClass());
	}

	public getMemberPermissions(): Permissions {
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
	protected override type: DiscoveryType;

	public override toJSON(): Record<string, any> {
		return this.meta;
	}
}
