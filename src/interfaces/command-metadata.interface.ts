import { ApplicationCommandData } from 'discord.js';

export type ApplicationCommandMetadata = ApplicationCommandData & {
	instance?: Record<string, any>;
	prototype?: object;
	method?: string;
};
