import { Provider } from '@nestjs/common';
import { Client, ShardClientUtil } from 'discord.js';

export const ShardProvider: Provider<ShardClientUtil> = {
	provide: ShardClientUtil,
	useFactory: (client: Client) => client.shard,
	inject: [Client]
};
