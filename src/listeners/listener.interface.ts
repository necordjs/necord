import { ClientEventTypes } from 'discord.js';
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
} from './handlers';

export type NecordEvents = ClientEventTypes &
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
