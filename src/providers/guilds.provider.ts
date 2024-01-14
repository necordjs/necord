import { Provider } from '@nestjs/common';
import { Client, GuildManager } from 'discord.js';

export const GuildsProvider: Provider<GuildManager> = {
	provide: GuildManager,
	useFactory: (client: Client) => client.guilds,
	inject: [Client]
};
