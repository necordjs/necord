import { Message, PartialMessage } from 'discord.js';
import { Injectable } from '@nestjs/common';

import { CustomListener, CustomListenerHandler } from '../decorators';
import { BaseHandler } from './base.handler';
import { ContextOf } from '../../context';

export type CustomMessageUpdateEvents = {
	messagePinned: [Message | PartialMessage];
	messageContentEdited: [
		message: Message | PartialMessage,
		oldContent: string,
		newContent: string
	];
};

@CustomListener('messageUpdate')
@Injectable()
export class MessageUpdateHandler extends BaseHandler<CustomMessageUpdateEvents> {
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
