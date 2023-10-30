import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { BaseHandler } from './base.handler';
import { ContextOf } from '../../context';
import { ThreadChannel } from 'discord.js';

export type CustomThreadUpdateEvents = {
	threadStateUpdate: [oldThread: ThreadChannel, newThread: ThreadChannel];
	threadNameUpdate: [thread: ThreadChannel, oldName: string, newName: string];
	threadLockStateUpdate: [oldThread: ThreadChannel, newThread: ThreadChannel];
	threadRateLimitPerUserUpdate: [
		thread: ThreadChannel,
		oldRateLimit: number,
		newRateLimit: number
	];
	threadAutoArchiveDurationUpdate: [
		thread: ThreadChannel,
		oldDuration: number | string,
		newDuration: number | string
	];
};

@Injectable()
@CustomListener('threadUpdate')
export class ThreadUpdateHandler extends BaseHandler<CustomThreadUpdateEvents> {
	@CustomListenerHandler()
	public handleThreadStateUpdate([oldThread, newThread]: ContextOf<'threadUpdate'>) {
		if (oldThread.archived !== newThread.archived) {
			this.emit('threadStateUpdate', oldThread, newThread);
		}
	}

	@CustomListenerHandler()
	public handleThreadNameUpdate([oldThread, newThread]: ContextOf<'threadUpdate'>) {
		if (oldThread.name !== newThread.name) {
			this.emit('threadNameUpdate', newThread, oldThread.name, newThread.name);
		}
	}

	@CustomListenerHandler()
	public handleThreadLockUpdate([oldThread, newThread]: ContextOf<'threadUpdate'>) {
		if (oldThread.locked !== newThread.locked) {
			this.emit('threadLockStateUpdate', oldThread, newThread);
		}
	}

	@CustomListenerHandler()
	public handleThreadRateLimitPerUserUpdate([oldThread, newThread]: ContextOf<'threadUpdate'>) {
		if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
			this.emit(
				'threadRateLimitPerUserUpdate',
				newThread,
				oldThread.rateLimitPerUser,
				newThread.rateLimitPerUser
			);
		}
	}

	@CustomListenerHandler()
	public handleThreadAutoArchiveDurationUpdate([
		oldThread,
		newThread
	]: ContextOf<'threadUpdate'>) {
		if (oldThread.autoArchiveDuration !== newThread.autoArchiveDuration) {
			this.emit(
				'threadAutoArchiveDurationUpdate',
				newThread,
				oldThread.autoArchiveDuration,
				newThread.autoArchiveDuration
			);
		}
	}
}
