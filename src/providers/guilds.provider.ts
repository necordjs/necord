import { Client, GuildManager } from 'discord.js';
import { Provider } from '@nestjs/common';

export const GuildsProvider: Provider<GuildManager> = {
	provide: GuildManager,
	useFactory: (client: Client) => client.guilds,
	inject: [Client]
};
