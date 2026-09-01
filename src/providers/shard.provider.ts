import { Client, ShardClientUtil } from 'discord.js';
import { Provider } from '@nestjs/common';

export const ShardProvider: Provider<null | ShardClientUtil> = {
	provide: ShardClientUtil,
	useFactory: (client: Client) => client.shard,
	inject: [Client]
};
