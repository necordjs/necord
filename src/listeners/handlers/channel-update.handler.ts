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
		if (
			(oldChannel as GuildChannel).permissionOverwrites !==
			(newChannel as GuildChannel).permissionOverwrites
		) {
			this.emit(
				'guildChannelPermissionsUpdate',
				newChannel,
				(oldChannel as GuildChannel).permissionOverwrites,
				(newChannel as GuildChannel).permissionOverwrites
			);
		}
	}
}
