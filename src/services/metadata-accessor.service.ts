import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApplicationCommandData, ApplicationCommandSubGroupData, ChatInputApplicationCommandData } from 'discord.js';
import { ListenerMetadata, OptionMetadata, ComponentMetadata } from '../interfaces';
import {
	APPLICATION_COMMAND_METADATA,
	GROUP_METADATA,
	LISTENERS_METADATA,
	MESSAGE_COMPONENT_METADATA,
	OPTIONS_METADATA,
	SUBGROUP_METADATA
} from '../necord.constants';

@Injectable()
export class MetadataAccessorService {
	public constructor(private readonly reflector: Reflector) {}

	public getListenerMetadata(target: Record<string, any>, methodName: string): ListenerMetadata {
		return this.reflector.get(LISTENERS_METADATA, target[methodName]);
	}

	public getMessageComponentMetadata(target: Record<string, any>, methodName: string): ComponentMetadata {
		return this.reflector.get(MESSAGE_COMPONENT_METADATA, target[methodName]);
	}

	public getApplicationCommandMetadata(target: Record<string, any>, methodName: string): ApplicationCommandData {
		return this.reflector.get(APPLICATION_COMMAND_METADATA, target[methodName]);
	}

	public getOptionsMetadata(target: Record<string, any>, methodName: string): Record<string, OptionMetadata> {
		return this.reflector.get(OPTIONS_METADATA, target[methodName]) ?? {};
	}

	public getCommandGroupMetadata(target: Record<string, any>, methodName: string): ChatInputApplicationCommandData {
		return this.reflector.getAllAndOverride(GROUP_METADATA, [target[methodName], target.constructor]);
	}

	public getCommandSubGroupMetadata(target: Record<string, any>, methodName: string): ApplicationCommandSubGroupData {
		return this.reflector.getAllAndOverride(SUBGROUP_METADATA, [target[methodName], target.constructor]);
	}
}
