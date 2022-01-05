import { Injectable } from '@nestjs/common';
import { Context, On } from '../decorators';
import {
	Client,
	ClientEvents,
	DMChannel,
	Guild,
	GuildChannel,
	GuildFeatures,
	GuildMember,
	Message,
	NonThreadGuildBasedChannel,
	PartialMessage,
	PermissionOverwriteManager,
	Permissions,
	PremiumTier,
	PresenceStatus,
	Role,
	TextChannel,
	ThreadChannel,
	User,
	UserFlags,
	VoiceBasedChannel,
	VoiceChannel
} from 'discord.js';

export interface NecordEvents extends ClientEvents {
	// ChannelUpdate
	guildChannelPermissionsUpdate: [
		channel: DMChannel | NonThreadGuildBasedChannel,
		oldPermissions: PermissionOverwriteManager,
		newPermissions: PermissionOverwriteManager
	];
	guildChannelTopicUpdate: [
		channel: DMChannel | NonThreadGuildBasedChannel,
		oldTopic: string,
		newTopic: string
	];

	// GuildMemberUpdate
	guildMemberBoost: [member: GuildMember];
	guildMemberUnboost: [member: GuildMember];
	guildMemberRoleAdd: [member: GuildMember, role: Role];
	guildMemberRoleRemove: [member: GuildMember, role: Role];
	guildMemberNicknameUpdate: [member: GuildMember, oldNickname: string, newNickname: string];
	guildMemberEntered: [member: GuildMember];
	guildMemberAvatarAdd: [member: GuildMember, avatarURL: string];
	guildMemberAvatarUpdate: [member: GuildMember, oldAvatarURL: string, newAvatarURL: string];
	guildMemberAvatarRemove: [member: GuildMember, oldAvatarURL: string];

	// GuildUpdate
	guildBoostLevelUp: [guild: Guild, oldPremiumTier: PremiumTier, newPremiumTier: PremiumTier];
	guildBoostLevelDown: [oldGuild: Guild, newGuild: Guild];
	guildBannerAdd: [guild: Guild, bannerURL: string];
	guildAfkChannelAdd: [guild: Guild, afkChannel: VoiceChannel];
	guildVanityURLAdd: [guild: Guild, vanityURLCode: string];
	guildVanityURLUpdate: [guild: Guild, oldVanityURLCode: string, newVanityURLCode: string];
	guildVanityURLRemove: [guild: Guild, vanityURLCode: string];
	guildFeaturesUpdate: [guild: Guild, oldFeatures: GuildFeatures[], newFeatures: GuildFeatures[]];
	guildAcronymUpdate: [oldGuild: Guild, newGuild: Guild];
	guildOwnerUpdate: [oldGuild: Guild, newGuild: Guild];
	guildPartnerAdd: [guild: Guild];
	guildPartnerRemove: [guild: Guild];
	guildVerificationAdd: [guild: Guild];
	guildVerificationRemove: [guild: Guild];

	// MessageUpdate
	messagePinned: [Message<boolean> | PartialMessage];
	messageContentEdited: [
		message: Message<boolean> | PartialMessage,
		oldContent: string,
		newContent: string
	];

	// PresenceUpdate
	guildMemberOffline: [member: GuildMember, oldStatus: PresenceStatus];
	guildMemberOnline: [member: GuildMember, newStatus: PresenceStatus];

	// RoleUpdate
	rolePositionUpdate: [role: Role, oldPosition: number, newPosition: number];
	rolePermissionsUpdate: [
		role: Role,
		oldPermissions: Readonly<Permissions>,
		newPermissions: Readonly<Permissions>
	];
	roleIconAdd: [role: Role, iconURL: string];
	roleIconUpdate: [role: Role, oldIconURL: string, newIconURL: string];
	roleIconRemove: [role: Role, iconURL: string];

	// Thread Update
	threadStateUpdate: [oldThread: ThreadChannel, newThread: ThreadChannel];
	threadNameUpdate: [thread: ThreadChannel, oldName: string, newName: string];
	threadLockStateUpdate: [oldThread: ThreadChannel, newThread: ThreadChannel];
	threadRateLimitPerUserUpdate: [
		thread: ThreadChannel,
		oldRateLimit: number,
		newRateLimit: number
	];
	threadAutoArchiveDurationUpdate: [
		thread: ThreadChannel,
		oldDuration: number | string,
		newDuration: number | string
	];

	// User Update
	userAvatarUpdate: [user: User, oldAvatar: string, newAvatar: string];
	userUsernameUpdate: [user: User, oldUsername: string, newUsername: string];
	userDiscriminatorUpdate: [user: User, oldDiscriminator: string, newDiscriminator: string];
	userFlagsUpdate: [user: User, oldFlags: Readonly<UserFlags>, newFlags: Readonly<UserFlags>];

	// Voice State Update
	voiceChannelJoin: [member: GuildMember, channel: VoiceBasedChannel];
	voiceChannelSwitch: [
		member: GuildMember,
		oldChannel: VoiceBasedChannel,
		newChannel: VoiceBasedChannel
	];
	voiceChannelLeave: [member: GuildMember, channel: VoiceBasedChannel];
	voiceChannelMute: [member: GuildMember, type: 'self-muted' | 'server-muted'];
	voiceChannelUnmute: [member: GuildMember, type: 'self-muted' | 'server-muted'];
	voiceChannelDeaf: [member: GuildMember, type: 'self-deafed' | 'server-deafed'];
	voiceChannelUndeaf: [member: GuildMember, type: 'self-deafed' | 'server-deafed'];
	voiceStreamingStart: [member: GuildMember, channel: VoiceBasedChannel];
	voiceStreamingStop: [member: GuildMember, channel: VoiceBasedChannel];
}

export type NecordContextOf<K extends keyof NecordEvents> = NecordEvents[K];

@Injectable()
export class ExtendListenersUpdate {
	public constructor(private readonly client: Client) {}

	private emit<K extends keyof NecordEvents>(event: K, ...args: NecordEvents[K]) {
		this.client.emit<any>(event, ...args);
	}

	@On('channelUpdate')
	public onChannelUpdate(@Context() [oldChannel, newChannel]: NecordContextOf<'channelUpdate'>) {
		if (!Object.prototype.hasOwnProperty.call(oldChannel, 'guild')) return;

		if (
			(oldChannel as GuildChannel).permissionOverwrites !==
			(newChannel as GuildChannel).permissionOverwrites
		) {
			this.emit(
				'guildChannelPermissionsUpdate',
				newChannel,
				(oldChannel as GuildChannel).permissionOverwrites,
				(newChannel as GuildChannel).permissionOverwrites
			);
		}

		if (
			oldChannel.type === 'GUILD_TEXT' &&
			(oldChannel as TextChannel).topic !== (newChannel as TextChannel).topic
		) {
			this.emit(
				'guildChannelTopicUpdate',
				newChannel,
				(oldChannel as TextChannel).topic,
				(newChannel as TextChannel).topic
			);
		}
	}

	@On('guildMemberUpdate')
	public onGuildMemberUpdate(
		@Context() [oldMember, newMember]: NecordContextOf<'guildMemberUpdate'>
	) {
		if (oldMember.partial) return;

		if (!oldMember.premiumSince && newMember.premiumSince) {
			this.emit('guildMemberBoost', newMember);
		}

		if (oldMember.premiumSince && !newMember.premiumSince) {
			this.emit('guildMemberUnboost', newMember);
		}

		const addedRoles: Role[] = newMember.roles.cache.reduce(
			(acc, role) => (!oldMember.roles.cache.has(role.id) ? acc.push(role) && acc : acc),
			[]
		);

		addedRoles.forEach(role => {
			this.emit('guildMemberRoleAdd', newMember, role);
		});

		const removedRoles: Role[] = oldMember.roles.cache.reduce(
			(acc, role) => (!newMember.roles.cache.has(role.id) ? acc.push(role) && acc : acc),
			[]
		);

		removedRoles.forEach(role => {
			this.emit('guildMemberRoleRemove', newMember, role);
		});

		if (oldMember.nickname !== newMember.nickname) {
			this.emit(
				'guildMemberNicknameUpdate',
				newMember,
				oldMember.nickname,
				newMember.nickname
			);
		}

		if (oldMember.pending !== newMember.pending) {
			this.emit('guildMemberEntered', newMember);
		}

		if (!oldMember.avatar && newMember.avatar) {
			this.emit('guildMemberAvatarAdd', newMember, newMember.avatarURL());
		}

		if (oldMember.avatar !== newMember.avatar) {
			this.emit(
				'guildMemberAvatarUpdate',
				newMember,
				oldMember.avatarURL(),
				newMember.avatarURL()
			);
		}

		if (oldMember.avatar && !newMember.avatar) {
			this.emit('guildMemberAvatarRemove', newMember, oldMember.avatarURL());
		}
	}

	@On('guildUpdate')
	public onGuildUpdate(@Context() [oldGuild, newGuild]: NecordContextOf<'guildUpdate'>) {
		if (oldGuild.premiumTier < newGuild.premiumTier) {
			this.emit('guildBoostLevelUp', newGuild, oldGuild.premiumTier, newGuild.premiumTier);
		}

		if (oldGuild.premiumTier > newGuild.premiumTier) {
			this.emit('guildBoostLevelDown', oldGuild, newGuild);
		}

		if (!oldGuild.banner && newGuild.banner) {
			this.emit('guildBannerAdd', newGuild, newGuild.bannerURL());
		}

		if (!oldGuild.afkChannel && newGuild.afkChannel) {
			this.emit('guildAfkChannelAdd', newGuild, newGuild.afkChannel);
		}

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

		if (oldGuild.features.length !== newGuild.features.length) {
			this.emit('guildFeaturesUpdate', newGuild, oldGuild.features, newGuild.features);
		}

		if (oldGuild.nameAcronym !== newGuild.nameAcronym) {
			this.emit('guildAcronymUpdate', oldGuild, newGuild);
		}

		if (oldGuild.ownerId !== newGuild.ownerId) {
			this.emit('guildOwnerUpdate', oldGuild, newGuild);
		}

		if (!oldGuild.partnered && newGuild.partnered) {
			this.emit('guildPartnerAdd', newGuild);
		}

		if (oldGuild.partnered && !newGuild.partnered) {
			this.emit('guildPartnerRemove', newGuild);
		}

		if (!oldGuild.verified && newGuild.verified) {
			this.emit('guildVerificationAdd', newGuild);
		}

		if (oldGuild.verified && !newGuild.verified) {
			this.emit('guildVerificationRemove', newGuild);
		}
	}

	@On('messageUpdate')
	public onMessageUpdate(@Context() [oldMessage, newMessage]: NecordContextOf<'messageUpdate'>) {
		if (oldMessage.partial || newMessage.partial) return;
		if (!oldMessage.pinned && newMessage.pinned) {
			this.emit('messagePinned', newMessage);
		}

		if (oldMessage.content !== newMessage.content) {
			this.emit('messageContentEdited', newMessage, oldMessage.content, newMessage.content);
		}
	}

	@On('presenceUpdate')
	public onPresenceUpdate(
		@Context() [oldPresence, newPresence]: NecordContextOf<'presenceUpdate'>
	) {
		if (!oldPresence) return;

		if (oldPresence.status !== 'offline' && newPresence.status === 'offline') {
			this.emit('guildMemberOffline', newPresence.member, oldPresence.status);
		}

		if (oldPresence.status === 'offline' && newPresence.status !== 'offline') {
			this.emit('guildMemberOnline', newPresence.member, newPresence.status);
		}
	}

	@On('roleUpdate')
	public onRoleUpdate(@Context() [oldRole, newRole]: NecordContextOf<'roleUpdate'>) {
		if (oldRole.rawPosition !== newRole.rawPosition) {
			this.emit('rolePositionUpdate', newRole, oldRole.rawPosition, newRole.rawPosition);
		}

		if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
			this.emit('rolePermissionsUpdate', newRole, oldRole.permissions, newRole.permissions);
		}

		if (!oldRole.icon && newRole.icon) {
			this.emit('roleIconAdd', newRole, newRole.iconURL());
		}

		if (oldRole.icon !== newRole.icon) {
			this.emit('roleIconUpdate', newRole, oldRole.iconURL(), newRole.iconURL());
		}

		if (oldRole.icon && !newRole.icon) {
			this.emit('roleIconRemove', newRole, oldRole.iconURL());
		}
	}

	@On('threadUpdate')
	public onThreadUpdate(@Context() [oldThread, newThread]: NecordContextOf<'threadUpdate'>) {
		if (!Object.prototype.hasOwnProperty.call(oldThread, 'guild')) return;

		if (oldThread.archived !== newThread.archived) {
			this.emit('threadStateUpdate', oldThread, newThread);
		}

		if (oldThread.name !== newThread.name) {
			this.emit('threadNameUpdate', newThread, oldThread.name, newThread.name);
		}

		if (oldThread.locked !== newThread.locked) {
			this.emit('threadLockStateUpdate', oldThread, newThread);
		}

		if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
			this.emit(
				'threadRateLimitPerUserUpdate',
				newThread,
				oldThread.rateLimitPerUser,
				newThread.rateLimitPerUser
			);
		}

		if (oldThread.autoArchiveDuration !== newThread.autoArchiveDuration) {
			this.emit(
				'threadAutoArchiveDurationUpdate',
				newThread,
				oldThread.autoArchiveDuration,
				newThread.autoArchiveDuration
			);
		}
	}

	@On('userUpdate')
	public onUserUpdate(@Context() [oldUser, newUser]: NecordContextOf<'userUpdate'>) {
		if (oldUser.partial) return;

		if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
			this.emit(
				'userAvatarUpdate',
				newUser,
				oldUser.displayAvatarURL(),
				newUser.displayAvatarURL()
			);
		}

		if (oldUser.username !== newUser.username) {
			this.emit('userUsernameUpdate', newUser, oldUser.username, newUser.username);
		}

		if (oldUser.discriminator !== newUser.discriminator) {
			this.emit(
				'userDiscriminatorUpdate',
				newUser,
				oldUser.discriminator,
				newUser.discriminator
			);
		}

		if (oldUser.flags !== newUser.flags) {
			this.emit('userFlagsUpdate', newUser, oldUser.flags, newUser.flags);
		}
	}

	@On('voiceStateUpdate')
	public onVoiceStateUpdate(
		@Context() [oldState, newState]: NecordContextOf<'voiceStateUpdate'>
	) {
		const oldMember = oldState.member;
		const newMember = newState.member;

		if (!oldState.channel && newState.channel) {
			this.emit('voiceChannelJoin', newMember, newState.channel);
		}

		if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
			this.emit('voiceChannelSwitch', newMember, oldState.channel, newState.channel);
		}

		if (oldState.channel && !newState.channel) {
			this.emit('voiceChannelLeave', newMember, oldState.channel);
		}

		if (!oldState.mute && newState.mute) {
			this.emit(
				'voiceChannelMute',
				newMember,
				newState.selfMute ? 'self-muted' : 'server-muted'
			);
		}

		if (oldState.mute && !newState.mute) {
			this.emit(
				'voiceChannelUnmute',
				newMember,
				oldState.selfMute ? 'self-muted' : 'server-muted'
			);
		}

		if (!oldState.deaf && newState.deaf) {
			this.emit(
				'voiceChannelDeaf',
				newMember,
				newState.selfDeaf ? 'self-deafed' : 'server-deafed'
			);
		}

		if (oldState.deaf && !newState.deaf) {
			this.emit(
				'voiceChannelUndeaf',
				newMember,
				oldState.selfDeaf ? 'self-deafed' : 'server-deafed'
			);
		}

		if (!oldState.streaming && newState.streaming) {
			this.emit('voiceStreamingStart', newMember, newState.channel);
		}

		if (oldState.streaming && !newState.streaming) {
			this.emit('voiceStreamingStop', newMember, newState.channel);
		}
	}
}
