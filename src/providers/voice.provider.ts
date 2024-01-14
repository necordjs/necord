import { Provider } from '@nestjs/common';
import { Client, ClientVoiceManager } from 'discord.js';

export const VoiceProvider: Provider<ClientVoiceManager> = {
	provide: ClientVoiceManager,
	useFactory: (client: Client) => client.voice,
	inject: [Client]
};
