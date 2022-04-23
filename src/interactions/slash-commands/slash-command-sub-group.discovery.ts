import { InteractionDiscovery } from '../interaction.discovery';
import { mix } from 'ts-mixer';
import { ClassDiscoveryMixin, DiscoveryType, MethodDiscoveryMixin } from '../../common';
import { ApplicationCommandSubCommandData, Snowflake } from 'discord.js';
import { GUILDS_METADATA } from '../../necord.constants';

export interface SlashCommandGroupDiscovery
	extends ClassDiscoveryMixin<ApplicationCommandSubCommandData> {}

@mix(ClassDiscoveryMixin)
export class SlashCommandGroupDiscovery extends InteractionDiscovery {
	protected readonly type: DiscoveryType;

	public getGuilds(): Set<Snowflake> {
		return new Set(this.reflector.getAllAndMerge(GUILDS_METADATA, [this.getClass()]));
	}

	public toJSON(): Record<string, any> {
		return this.meta;
	}
}

export interface SlashCommandSubGroupDiscovery
	extends MethodDiscoveryMixin<ApplicationCommandSubCommandData> {}

@mix(MethodDiscoveryMixin)
export class SlashCommandSubGroupDiscovery extends InteractionDiscovery {
	protected readonly type: DiscoveryType;

	public getGuilds(): Set<Snowflake> {
		return new Set(
			this.reflector.getAllAndMerge(GUILDS_METADATA, [this.getHandler(), this.getClass()])
		);
	}

	public toJSON(): Record<string, any> {
		return this.meta;
	}
}
