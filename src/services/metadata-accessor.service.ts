import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApplicationCommandExecuteMetadata, ListenerMetadata } from '../interfaces';
import {
	APPLICATION_COMMAND_METADATA,
	GROUP_METADATA,
	LISTENERS_METADATA,
	OPTIONS_METADATA
} from '../necord.constants';
import { ApplicationCommandOptionData } from 'discord.js';

@Injectable()
export class MetadataAccessorService {
	public constructor(private readonly reflector: Reflector) {}

	public getListenerMetadata(target: Record<string, Function>, methodName: string): ListenerMetadata {
		return this.reflector.get(LISTENERS_METADATA, target[methodName]);
	}

	public getCommandGroup(target: Record<string, Function>, methodName: string): string {
		return this.reflector.getAllAndOverride(GROUP_METADATA, [target[methodName], target.constructor]);
	}

	public getApplicationCommand(
		target: Record<string, Function>,
		methodName: string
	): ApplicationCommandExecuteMetadata {
		return this.reflector.get(APPLICATION_COMMAND_METADATA, target[methodName]);
	}

	public getOptions(target: Record<string, Function>, methodName: string): Array<ApplicationCommandOptionData> {
		const metadata = this.reflector.get(OPTIONS_METADATA, target[methodName]);

		return metadata.sort((a, b) => a.parameterIndex - b.parameterIndex);
	}
}
