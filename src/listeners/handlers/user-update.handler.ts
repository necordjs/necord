import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { BaseHandler } from './base.handler';
import { ContextOf } from '../../context';
import { User, UserFlagsBitField } from 'discord.js';

export type CustomUserUpdateEvents = {
	userAvatarUpdate: [user: User, oldAvatar: string, newAvatar: string];
	userUsernameUpdate: [user: User, oldUsername: string, newUsername: string];
	userDiscriminatorUpdate: [user: User, oldDiscriminator: string, newDiscriminator: string];
	userFlagsUpdate: [
		user: User,
		oldFlags: Readonly<UserFlagsBitField>,
		newFlags: Readonly<UserFlagsBitField>
	];
	userServerTagAdd: [user: User, tag: string];
	userServerTagRemove: [user: User, tag: string];
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
	public handleUserServerTags([oldUser, newUser]: ContextOf<'userUpdate'>) {
		if (oldUser.partial) return;

		const oldTag = oldUser.primaryGuild?.tag;
		const newTag = newUser.primaryGuild?.tag;

		if (!oldTag && newTag) {
			this.emit('userServerTagAdd', newUser, newTag);
		}

		if (oldTag && !newTag) {
			this.emit('userServerTagRemove', newUser, oldTag);
		}
	}
}
