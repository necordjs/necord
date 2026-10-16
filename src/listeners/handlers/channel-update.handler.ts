import {
	DMChannel,
	GuildChannel,
	NonThreadGuildBasedChannel,
	PermissionOverwriteManager
} from 'discord.js';
import { Injectable } from '@nestjs/common';

import { CustomListener, CustomListenerHandler } from '../decorators/index.js';
import { ContextOf } from '../../context/index.js';
import { BaseHandler } from './base.handler.js';

export type CustomChannelUpdateEvents = {
	guildChannelPermissionsUpdate: [
		channel: DMChannel | NonThreadGuildBasedChannel,
		oldPermissions: PermissionOverwriteManager,
		newPermissions: PermissionOverwriteManager
	];
};

@CustomListener('channelUpdate')
@Injectable()
export class ChannelUpdateHandler extends BaseHandler<CustomChannelUpdateEvents> {
	@CustomListenerHandler()
	public handleGuildChannelPermissionsUpdate([
		oldChannel,
		newChannel
	]: ContextOf<'channelUpdate'>) {
		const oldPermissions = (oldChannel as GuildChannel).permissionOverwrites;
		const newPermissions = (newChannel as GuildChannel).permissionOverwrites;

		if (!oldPermissions || !newPermissions) return;

		if (this.hasPermissionOverwritesChanged(oldPermissions, newPermissions)) {
			this.emit('guildChannelPermissionsUpdate', newChannel, oldPermissions, newPermissions);
		}
	}

	private hasPermissionOverwritesChanged(
		oldPermissions: PermissionOverwriteManager,
		newPermissions: PermissionOverwriteManager
	) {
		if (oldPermissions.cache.size !== newPermissions.cache.size) return true;

		return oldPermissions.cache.some(oldOverwrite => {
			const newOverwrite = newPermissions.cache.get(oldOverwrite.id);

			return (
				oldOverwrite.allow.bitfield !== newOverwrite?.allow.bitfield ||
				oldOverwrite.deny.bitfield !== newOverwrite?.deny.bitfield
			);
		});
	}
}
