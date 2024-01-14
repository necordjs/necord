import { Provider } from '@nestjs/common';
import { ChannelManager, Client } from 'discord.js';

export const ChannelsProvider: Provider<ChannelManager> = {
	provide: ChannelManager,
	useFactory: (client: Client) => client.channels,
	inject: [Client]
};
