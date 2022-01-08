import {
	ApplicationCommandData,
	ApplicationCommandOptionChoice,
	ApplicationCommandOptionData,
	ApplicationCommandSubCommandData,
	ApplicationCommandSubGroupData,
	AutocompleteInteraction,
	ChatInputApplicationCommandData,
	CommandInteractionOptionResolver,
	MessageComponentType
} from 'discord.js';
import { OPTIONS_METADATA } from '../necord.constants';
import { NecordEvents } from './necord-events.interface';
import { Module } from '@nestjs/core/injector/module';
import { Type } from '@nestjs/common';

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

export interface SimpleCommandMetadata extends BaseMetadata {
	name: string;
	description?: string;
}

export type ContextMenuMetadata = Exclude<ApplicationCommandData, ChatInputApplicationCommandData> &
	BaseMetadata;

export type SlashCommandMetadata = Extract<
	ApplicationCommandData,
	ChatInputApplicationCommandData
> &
	BaseMetadata;

export type OptionMetadata<T = any> = Exclude<
	ApplicationCommandOptionData,
	ApplicationCommandSubGroupData | ApplicationCommandSubCommandData
> & {
	type?: T;
	methodName?: keyof CommandInteractionOptionResolver;
};

export interface TransformOptions {
	transformOptions(
		interaction: AutocompleteInteraction,
		focused: ApplicationCommandOptionChoice
	): ApplicationCommandOptionChoice[] | Promise<ApplicationCommandOptionChoice[]>;
}
