import { BaseHandler } from './base.handler';
import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { ContextOf } from '../../context';
import { AuditLogEvent, GuildAuditLogsEntry } from 'discord.js';

@Injectable()
@CustomListener('guildAuditLogEntryCreate')
export class GuildAuditLogEntryCreateHandler extends BaseHandler {
	@CustomListenerHandler()
	public handleGuildAuditLogEntryChanges([
		auditLogEntry,
		guild
	]: ContextOf<'guildAuditLogEntryCreate'>) {
		const { actionType } = auditLogEntry;

		switch (actionType) {
			case 'Create':
				this.emit('guildAuditLogEntryAdd', auditLogEntry, guild);
				break;
			case 'Update':
				this.emit('guildAuditLogEntryUpdate', auditLogEntry, guild);
				break;
			case 'Delete':
				this.emit('guildAuditLogEntryDelete', auditLogEntry, guild);
				break;
		}
	}

	@CustomListenerHandler()
	public handleGuildAuditLogEntryWebhookChanges([
		auditLogEntry,
		guild
	]: ContextOf<'guildAuditLogEntryCreate'>) {
		const { actionType, targetType } = auditLogEntry;

		if (targetType !== 'Webhook') {
			return;
		}

		switch (actionType) {
			case 'Create':
				this.emit(
					'guildAuditLogEntryWebhookCreate',
					auditLogEntry as GuildAuditLogsEntry<AuditLogEvent.WebhookCreate>,
					guild
				);
				break;
			case 'Update':
				this.emit(
					'guildAuditLogEntryWebhookUpdate',
					auditLogEntry as GuildAuditLogsEntry<AuditLogEvent.WebhookUpdate>,
					guild
				);
				break;
			case 'Delete':
				this.emit(
					'guildAuditLogEntryWebhookDelete',
					auditLogEntry as GuildAuditLogsEntry<AuditLogEvent.WebhookDelete>,
					guild
				);
				break;
		}
	}
}
