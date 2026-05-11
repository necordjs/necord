import { Client, WebSocketManager } from 'discord.js';
import { Provider } from '@nestjs/common';

export const WsProvider: Provider<WebSocketManager> = {
	provide: WebSocketManager,
	useFactory: (client: Client) => client.ws,
	inject: [Client]
};
