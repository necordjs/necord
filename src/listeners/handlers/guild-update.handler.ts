import { BaseHandler } from './base.handler';
import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { ContextOf } from '../../context';
import { Guild, GuildFeature, GuildPremiumTier, VoiceChannel } from 'discord.js';

export type CustomGuildUpdateEvents = {
	guildBoostLevelUp: [
		guild: Guild,
		oldPremiumTier: GuildPremiumTier,
		newPremiumTier: GuildPremiumTier
	];
	guildBoostLevelDown: [oldGuild: Guild, newGuild: Guild];
	guildBannerAdd: [guild: Guild, bannerURL: string];
	guildAfkChannelAdd: [guild: Guild, afkChannel: VoiceChannel];
	guildVanityURLAdd: [guild: Guild, vanityURLCode: string];
	guildVanityURLUpdate: [guild: Guild, oldVanityURLCode: string, newVanityURLCode: string];
	guildVanityURLRemove: [guild: Guild, vanityURLCode: string];
	guildFeaturesUpdate: [
		guild: Guild,
		oldFeatures: `${GuildFeature}`[],
		newFeatures: `${GuildFeature}`[]
	];
	guildAcronymUpdate: [oldGuild: Guild, newGuild: Guild];
	guildOwnerUpdate: [oldGuild: Guild, newGuild: Guild];
	guildPartnerAdd: [guild: Guild];
	guildPartnerRemove: [guild: Guild];
	guildVerificationAdd: [guild: Guild];
	guildVerificationRemove: [guild: Guild];
};

@Injectable()
@CustomListener('guildUpdate')
export class GuildUpdateHandler extends BaseHandler<CustomGuildUpdateEvents> {
	@CustomListenerHandler()
	public handleGuildBoostLevel([oldGuild, newGuild]: ContextOf<'guildUpdate'>) {
		if (oldGuild.premiumTier < newGuild.premiumTier) {
			this.emit('guildBoostLevelUp', newGuild, oldGuild.premiumTier, newGuild.premiumTier);
		}

		if (oldGuild.premiumTier > newGuild.premiumTier) {
			this.emit('guildBoostLevelDown', oldGuild, newGuild);
		}
	}

	@CustomListenerHandler()
	public handleGuildVanityURL([oldGuild, newGuild]: ContextOf<'guildUpdate'>) {
		if (!oldGuild.vanityURLCode && newGuild.vanityURLCode) {
			this.emit('guildVanityURLAdd', newGuild, newGuild.vanityURLCode);
		}

		if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
			this.emit(
				'guildVanityURLUpdate',
				newGuild,
				oldGuild.vanityURLCode,
				newGuild.vanityURLCode
			);
		}

		if (oldGuild.vanityURLCode && !newGuild.vanityURLCode) {
			this.emit('guildVanityURLRemove', newGuild, oldGuild.vanityURLCode);
		}
	}

	@CustomListenerHandler()
	public handleGuildPartnered([oldGuild, newGuild]: ContextOf<'guildUpdate'>) {
		if (!oldGuild.partnered && newGuild.partnered) {
			this.emit('guildPartnerAdd', newGuild);
		}

		if (oldGuild.partnered && !newGuild.partnered) {
			this.emit('guildPartnerRemove', newGuild);
		}
	}

	@CustomListenerHandler()
	public handleGuildVerification([oldGuild, newGuild]: ContextOf<'guildUpdate'>) {
		if (!oldGuild.verified && newGuild.verified) {
			this.emit('guildVerificationAdd', newGuild);
		}

		if (oldGuild.verified && !newGuild.verified) {
			this.emit('guildVerificationRemove', newGuild);
		}
	}

	@CustomListenerHandler()
	public handleGuildChanges([oldGuild, newGuild]: ContextOf<'guildUpdate'>) {
		if (!oldGuild.banner && newGuild.banner) {
			this.emit('guildBannerAdd', newGuild, newGuild.bannerURL());
		}

		if (!oldGuild.afkChannel && newGuild.afkChannel) {
			this.emit('guildAfkChannelAdd', newGuild, newGuild.afkChannel);
		}

		if (oldGuild.features.length !== newGuild.features.length) {
			this.emit('guildFeaturesUpdate', newGuild, oldGuild.features, newGuild.features);
		}

		if (oldGuild.nameAcronym !== newGuild.nameAcronym) {
			this.emit('guildAcronymUpdate', oldGuild, newGuild);
		}

		if (oldGuild.ownerId !== newGuild.ownerId) {
			this.emit('guildOwnerUpdate', oldGuild, newGuild);
		}
	}
}
