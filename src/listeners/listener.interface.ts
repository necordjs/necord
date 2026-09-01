import { ClientEvents } from 'discord.js';

import {
	CustomChannelUpdateEvents,
	CustomGuildAuditLogEntryCreateEvents,
	CustomGuildMemberUpdateEvents,
	CustomGuildUpdateEvents,
	CustomMessageUpdateEvents,
	CustomPresenceUpdateEvents,
	CustomRoleUpdateEvents,
	CustomThreadUpdateEvents,
	CustomUserUpdateEvents,
	CustomVoiceStateUpdateEvents
} from './handlers/index.js';

export type NecordEvents = ClientEvents &
	CustomChannelUpdateEvents &
	CustomGuildAuditLogEntryCreateEvents &
	CustomGuildMemberUpdateEvents &
	CustomGuildUpdateEvents &
	CustomMessageUpdateEvents &
	CustomPresenceUpdateEvents &
	CustomRoleUpdateEvents &
	CustomThreadUpdateEvents &
	CustomUserUpdateEvents &
	CustomVoiceStateUpdateEvents;
