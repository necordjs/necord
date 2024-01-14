import { Provider } from '@nestjs/common';
import { Client, ClientApplication } from 'discord.js';

export const ApplicationProvider: Provider<ClientApplication> = {
	provide: ClientApplication,
	useFactory: (client: Client) => client.application,
	inject: [Client]
};
