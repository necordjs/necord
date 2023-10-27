import { BaseHandler } from './base.handler';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { Injectable } from '@nestjs/common';
import { ContextOf } from '../../context';

@Injectable()
@CustomListener()
export class MessageUpdateHandler extends BaseHandler {
	@CustomListenerHandler()
	public handleMessagePinned([oldMessage, newMessage]: ContextOf<'messageUpdate'>) {
		if (oldMessage.partial || newMessage.partial) return;

		if (!oldMessage.pinned && newMessage.pinned) {
			this.emit('messagePinned', newMessage);
		}
	}

	@CustomListenerHandler()
	public handleMessageContentEdited([oldMessage, newMessage]: ContextOf<'messageUpdate'>) {
		if (oldMessage.partial || newMessage.partial) return;

		if (oldMessage.content !== newMessage.content) {
			this.emit('messageContentEdited', newMessage, oldMessage.content, newMessage.content);
		}
	}
}
