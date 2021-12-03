import { Provider } from '@nestjs/common';
import { ApplicationCommandData } from 'discord.js';

export const APPLICATION_COMMANDS = 'necord:application_commands';

export const applicationCommandsProvider: Provider<ApplicationCommandData[]> = {
	provide: APPLICATION_COMMANDS,
	useValue: []
};
