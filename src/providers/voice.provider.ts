import { Client, ClientVoiceManager } from 'discord.js';
import { Provider } from '@nestjs/common';

export const VoiceProvider: Provider<ClientVoiceManager> = {
	provide: ClientVoiceManager,
	useFactory: (client: Client) => client.voice,
	inject: [Client]
};
