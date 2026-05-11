import { Client, UserManager } from 'discord.js';
import { Provider } from '@nestjs/common';

export const UsersProvider: Provider<UserManager> = {
	provide: UserManager,
	useFactory: (client: Client) => client.users,
	inject: [Client]
};
