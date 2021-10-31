import { ListenerMetadata } from './listener-metadata.interface';
import { ApplicationCommandData, ApplicationCommandOptionData } from 'discord.js';

export type ExecuteMetadata = {
	execute?: (...args) => Promise<any> | any;
};

export type ListenerExecuteMetadata = ListenerMetadata & ExecuteMetadata;

export type ApplicationCommandExecuteMetadata = ApplicationCommandData &
	ExecuteMetadata & {
		description: string;
		group?: string;
		subGroup?: string;
		options: ApplicationCommandOptionData[];
	};
