import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { BaseHandler } from './base.handler';
import { ContextOf } from '../../context';
import { UserPrimaryGuild, User, UserFlagsBitField } from 'discord.js';

export type CustomUserUpdateEvents = {
	userAvatarUpdate: [user: User, oldAvatar: string, newAvatar: string];
	userUsernameUpdate: [user: User, oldUsername: string, newUsername: string];
	userDiscriminatorUpdate: [user: User, oldDiscriminator: string, newDiscriminator: string];
	userFlagsUpdate: [
		user: User,
		oldFlags: Readonly<UserFlagsBitField>,
		newFlags: Readonly<UserFlagsBitField>
	];
	userPrimaryGuildUpdate: [
		oldPrimaryGuild: UserPrimaryGuild | null,
		newPrimaryGuild: UserPrimaryGuild | null
	];
};

@Injectable()
@CustomListener('userUpdate')
export class UserUpdateHandler extends BaseHandler<CustomUserUpdateEvents> {
	@CustomListenerHandler()
	public handleUserAvatarUpdate([oldUser, newUser]: ContextOf<'userUpdate'>) {
		if (oldUser.partial) return;

		if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
			this.emit(
				'userAvatarUpdate',
				newUser,
				oldUser.displayAvatarURL(),
				newUser.displayAvatarURL()
			);
		}
	}

	@CustomListenerHandler()
	public handleUserUsernameUpdate([oldUser, newUser]: ContextOf<'userUpdate'>) {
		if (oldUser.partial) return;

		if (oldUser.username !== newUser.username) {
			this.emit('userUsernameUpdate', newUser, oldUser.username, newUser.username);
		}
	}

	@CustomListenerHandler()
	public handleUserDiscriminatorUpdate([oldUser, newUser]: ContextOf<'userUpdate'>) {
		if (oldUser.partial) return;

		if (oldUser.discriminator !== newUser.discriminator) {
			this.emit(
				'userDiscriminatorUpdate',
				newUser,
				oldUser.discriminator,
				newUser.discriminator
			);
		}
	}

	@CustomListenerHandler()
	public handleUserFlagsUpdate([oldUser, newUser]: ContextOf<'userUpdate'>) {
		if (oldUser.partial) return;

		if (oldUser.flags !== newUser.flags) {
			this.emit('userFlagsUpdate', newUser, oldUser.flags, newUser.flags);
		}
	}

	@CustomListenerHandler()
	public handleUserPrimaryGuildUpdate([oldUser, newUser]: ContextOf<'userUpdate'>) {
		if (oldUser.partial) return;

		const oldPrimaryGuild = JSON.stringify(oldUser.primaryGuild);
		const newPrimaryGuild = JSON.stringify(newUser.primaryGuild);

		if (oldPrimaryGuild !== newPrimaryGuild) {
			this.emit('userPrimaryGuildUpdate', oldUser.primaryGuild, newUser.primaryGuild);
		}
	}
}
