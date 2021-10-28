import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ListenerMetadata } from './listener-metadata.interface';
import { ApplicationCommandData, ApplicationCommandOptionData } from 'discord.js';

export type ExecuteMetadata = {
	execute?: (...args) => Promise<any> | any;
};

export type ListenerExecuteMetadata = ListenerMetadata & ExecuteMetadata;

export type ContextMenuExecuteMetadata = ContextMenuCommandBuilder & ExecuteMetadata;

export type SlashCommandExecuteMetadata = {
	name: string;
	description: string;
	group?: string;
	subGroup?: string;
	options: ApplicationCommandOptionData[];
} & ExecuteMetadata;

export type ApplicationCommandExecuteMetadata = ApplicationCommandData &
	ExecuteMetadata & {
		description: string;
		group?: string;
		subGroup?: string;
		options: ApplicationCommandOptionData[];
	};
