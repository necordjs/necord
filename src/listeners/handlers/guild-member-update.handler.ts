import { GuildMember, Role } from 'discord.js';
import { Injectable } from '@nestjs/common';

import { CustomListener, CustomListenerHandler } from '../decorators/index.js';
import { ContextOf } from '../../context/index.js';
import { BaseHandler } from './base.handler.js';

export type CustomGuildMemberUpdateEvents = {
	guildMemberBoost: [member: GuildMember];
	guildMemberUnboost: [member: GuildMember];
	guildMemberRoleAdd: [member: GuildMember, role: Role];
	guildMemberRoleRemove: [member: GuildMember, role: Role];
	guildMemberNicknameUpdate: [
		member: GuildMember,
		oldNickname: string | null,
		newNickname: string | null
	];
	guildMemberEntered: [member: GuildMember];
	guildMemberAvatarAdd: [member: GuildMember, avatarURL: string | null];
	guildMemberAvatarUpdate: [
		member: GuildMember,
		oldAvatarURL: string | null,
		newAvatarURL: string | null
	];
	guildMemberAvatarRemove: [member: GuildMember, oldAvatarURL: string | null];
};

@CustomListener('guildMemberUpdate')
@Injectable()
export class GuildMemberUpdateHandler extends BaseHandler<CustomGuildMemberUpdateEvents> {
	@CustomListenerHandler()
	public handleGuildMemberAvatar([oldMember, newMember]: ContextOf<'guildMemberUpdate'>) {
		if (oldMember.partial) return;

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

	@CustomListenerHandler()
	public handleGuildMemberRoles([oldMember, newMember]: ContextOf<'guildMemberUpdate'>) {
		if (oldMember.partial) return;

		const addedRoles = newMember.roles.cache.reduce<Role[]>((acc, role) => {
			if (!oldMember.roles.cache.has(role.id)) {
				acc.push(role);
			}

			return acc;
		}, []);

		addedRoles.forEach(role => {
			this.emit('guildMemberRoleAdd', newMember, role);
		});

		const removedRoles = oldMember.roles.cache.reduce<Role[]>((acc, role) => {
			if (!newMember.roles.cache.has(role.id)) {
				acc.push(role);
			}

			return acc;
		}, []);

		removedRoles.forEach(role => {
			this.emit('guildMemberRoleRemove', newMember, role);
		});
	}

	@CustomListenerHandler()
	public handleGuildMemberBoosting([oldMember, newMember]: ContextOf<'guildMemberUpdate'>) {
		if (oldMember.partial) return;

		if (!oldMember.premiumSince && newMember.premiumSince) {
			this.emit('guildMemberBoost', newMember);
		}

		if (oldMember.premiumSince && !newMember.premiumSince) {
			this.emit('guildMemberUnboost', newMember);
		}
	}

	@CustomListenerHandler()
	public handleGuildMemberNicknameUpdate([oldMember, newMember]: ContextOf<'guildMemberUpdate'>) {
		if (oldMember.partial) return;

		if (oldMember.nickname !== newMember.nickname) {
			this.emit(
				'guildMemberNicknameUpdate',
				newMember,
				oldMember.nickname,
				newMember.nickname
			);
		}
	}

	@CustomListenerHandler()
	public handleGuildMemberEntered([oldMember, newMember]: ContextOf<'guildMemberUpdate'>) {
		if (oldMember.partial) return;

		if (oldMember.pending !== newMember.pending) {
			this.emit('guildMemberEntered', newMember);
		}
	}
}
