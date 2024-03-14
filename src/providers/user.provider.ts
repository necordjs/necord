import { Provider } from '@nestjs/common';
import { Client, ClientUser } from 'discord.js';

export const UserProvider: Provider<ClientUser> = {
	provide: ClientUser,
	useFactory: (client: Client) => client.user,
	inject: [Client]
};
