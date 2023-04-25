import { BaseCollector } from './base.collector';
import {
	Message,
	MessageCollector as DiscordCollector,
	MessageCollectorOptions as DiscordCollectorOptions
} from 'discord.js';

export type MessageCollectorOptions = Omit<DiscordCollectorOptions, 'filter'>;

export abstract class MessageCollector extends BaseCollector<Message, MessageCollectorOptions> {
	protected abstract filter(original: Message, message: Message): boolean;

	protected abstract collect(original: Message, message: Message): void;

	protected ignore(original: Message, message: Message): void {}

	protected dispose(original: Message, message: Message): void {}

	protected getDiscordCollector(original: Message, options: MessageCollectorOptions) {
		return new DiscordCollector(original.channel, options) as any;
	}
}
