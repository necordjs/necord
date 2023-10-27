import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { BaseHandler } from './base.handler';
import { ContextOf } from '../../context';

@Injectable()
@CustomListener('threadUpdate')
export class ThreadUpdateHandler extends BaseHandler {
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
