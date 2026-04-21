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

		const member = newPresence.member;
		if (!member) return;

		if (oldPresence.status !== 'offline' && newPresence.status === 'offline') {
			this.emit('guildMemberOffline', member, oldPresence.status);
		}

		if (oldPresence.status === 'offline' && newPresence.status !== 'offline') {
			this.emit('guildMemberOnline', member, newPresence.status);
		}
	}
}
