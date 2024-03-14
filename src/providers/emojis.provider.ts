import { Provider } from '@nestjs/common';
import { Client, BaseGuildEmojiManager } from 'discord.js';

export const EmojisProvider: Provider<BaseGuildEmojiManager> = {
	provide: BaseGuildEmojiManager,
	useFactory: (client: Client) => client.emojis,
	inject: [Client]
};
