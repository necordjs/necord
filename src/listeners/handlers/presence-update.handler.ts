import { BaseHandler } from './base.handler';
import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { ContextOf } from '../../context';
import { GuildMember, PresenceStatus } from 'discord.js';

export type CustomPresenceUpdateEvents = {
	guildMemberOffline: [member: GuildMember, oldStatus: PresenceStatus];
	guildMemberOnline: [member: GuildMember, newStatus: PresenceStatus];
};

@Injectable()
@CustomListener('presenceUpdate')
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
