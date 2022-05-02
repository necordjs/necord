import {
	ButtonInteraction,
	ClientEvents,
	CommandInteraction,
	DMChannel,
	Guild,
	GuildFeature,
	GuildMember,
	GuildPremiumTier,
	Message,
	MessageContextMenuCommandInteraction,
	ModalSubmitInteraction,
	NonThreadGuildBasedChannel,
	PartialMessage,
	PermissionOverwriteManager,
	PermissionsBitField,
	PresenceStatus,
	Role,
	SelectMenuInteraction,
	ThreadChannel,
	User,
	UserContextMenuCommandInteraction,
	UserFlagsBitField,
	VoiceBasedChannel,
	VoiceChannel
} from 'discord.js';

export type SlashCommandContext = [CommandInteraction];

export type MessageCommandContext = [MessageContextMenuCommandInteraction];

export type UserCommandContext = [UserContextMenuCommandInteraction];

export type ModalContext = [ModalSubmitInteraction];

export type ButtonContext = [ButtonInteraction];

export type SelectMenuContext = [SelectMenuInteraction];

export type ContextOf<K extends keyof E, E = NecordEvents> = E[K];

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
	guildFeaturesUpdate: [guild: Guild, oldFeatures: GuildFeature[], newFeatures: GuildFeature[]];
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
		oldPermissions: Readonly<PermissionsBitField>,
		newPermissions: Readonly<PermissionsBitField>
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
	userFlagsUpdate: [
		user: User,
		oldFlags: Readonly<UserFlagsBitField>,
		newFlags: Readonly<UserFlagsBitField>
	];

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
