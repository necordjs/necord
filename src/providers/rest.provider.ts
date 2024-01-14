import { Provider } from '@nestjs/common';
import { Client, REST } from 'discord.js';

export const RestProvider: Provider<REST> = {
	provide: REST,
	useFactory: (client: Client) => client.rest,
	inject: [Client]
};
