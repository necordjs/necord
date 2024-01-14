import { Provider } from '@nestjs/common';
import { Client, WebSocketManager } from 'discord.js';

export const WsProvider: Provider<WebSocketManager> = {
	provide: WebSocketManager,
	useFactory: (client: Client) => client.ws,
	inject: [Client]
};
