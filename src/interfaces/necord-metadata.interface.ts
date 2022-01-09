import {
	ApplicationCommandOptionChoice,
	ApplicationCommandOptionData,
	ApplicationCommandSubCommandData,
	ApplicationCommandSubGroupData,
	AutocompleteInteraction,
	ChatInputApplicationCommandData,
	CommandInteractionOptionResolver,
	MessageApplicationCommandData,
	MessageComponentType,
	UserApplicationCommandData
} from 'discord.js';
import { OPTIONS_METADATA } from '../necord.constants';
import { NecordEvents } from './necord-events.interface';
import { Module } from '@nestjs/core/injector/module';
import { Type } from '@nestjs/common';

export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export interface BaseMetadata {
	metadata?: {
		[key: string]: any;

		host: Module;
		class: Type;
		handler?: Function;
		execute?: Function;

		[OPTIONS_METADATA]?: Record<string, OptionMetadata>;
	};
}

export interface ListenerMetadata<T extends keyof NecordEvents = keyof NecordEvents>
	extends BaseMetadata {
	type: 'once' | 'on';
	event: T;
}

export interface ComponentMetadata extends BaseMetadata {
	type: Exclude<MessageComponentType, 'ACTION_ROW'>;
	customId: string;
}

export interface TextCommandMetadata extends BaseMetadata {
	name: string;
	description?: string;
}

export type ContextMenuMetadata = (UserApplicationCommandData | MessageApplicationCommandData) &
	BaseMetadata;

export type SlashCommandMetadata = ChatInputApplicationCommandData & BaseMetadata;

export type CommandOptionData = Exclude<
	ApplicationCommandOptionData,
	ApplicationCommandSubCommandData | ApplicationCommandSubGroupData
>;

export type OptionMetadata<T extends CommandOptionData['type'] = any> = Extract<
	CommandOptionData & { type: T },
	ApplicationCommandOptionData
> & {
	methodName?: keyof CommandInteractionOptionResolver;
};

export interface TransformOptions {
	transformOptions(
		interaction: AutocompleteInteraction,
		focused: ApplicationCommandOptionChoice
	): ApplicationCommandOptionChoice[] | Promise<ApplicationCommandOptionChoice[]>;
}
