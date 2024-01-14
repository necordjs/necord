import { Provider } from '@nestjs/common';
import { Client, UserManager } from 'discord.js';

export const UsersProvider: Provider<UserManager> = {
	provide: UserManager,
	useFactory: (client: Client) => client.users,
	inject: [Client]
};
