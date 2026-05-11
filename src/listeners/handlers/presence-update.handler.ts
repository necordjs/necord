import { GuildMember, PresenceStatus } from 'discord.js';
import { Injectable } from '@nestjs/common';

import { CustomListener, CustomListenerHandler } from '../decorators';
import { BaseHandler } from './base.handler';
import { ContextOf } from '../../context';

export type CustomPresenceUpdateEvents = {
	guildMemberOffline: [member: GuildMember, oldStatus: PresenceStatus];
	guildMemberOnline: [member: GuildMember, newStatus: PresenceStatus];
};

@CustomListener('presenceUpdate')
@Injectable()
export class PresenceUpdateHandler extends BaseHandler<CustomPresenceUpdateEvents> {
	@CustomListenerHandler()
	public handlePresenceUpdate([oldPresence, newPresence]: ContextOf<'presenceUpdate'>) {
		if (!oldPresence) return;

		if (oldPresence.status !== 'offline' && newPresence.status === 'offline') {
			this.emit('guildMemberOffline', newPresence.member, oldPresence.status);
		}

		if (oldPresence.status === 'offline' && newPresence.status !== 'offline') {
			this.emit('guildMemberOnline', newPresence.member, newPresence.status);
		}
	}
}
