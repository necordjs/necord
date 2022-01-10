import { Collection } from 'discord.js';
import { Injectable, Type } from '@nestjs/common';
import { ParamMetadata } from '@nestjs/core/helpers/interfaces';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { NecordContextType, NecordParamsFactory } from './context';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import {
	ApplicationCommandMetadata,
	ComponentMetadata,
	ListenerMetadata,
	SlashCommandMetadata,
	TextCommandMetadata
} from './interfaces';
import {
	APPLICATION_COMMAND_METADATA,
	AUTOCOMPLETE_METADATA,
	GROUP_METADATA,
	GUILDS_METADATA,
	LISTENERS_METADATA,
	MESSAGE_COMPONENT_METADATA,
	OPTIONS_METADATA,
	PARAM_ARGS_METADATA,
	TEXT_COMMAND_METADATA
} from './necord.constants';

@Injectable()
export class NecordExplorer {
	private readonly necordParamsFactory = new NecordParamsFactory();

	private readonly wrappers = this.discoveryService.getProviders().filter(wrapper => {
		const { instance } = wrapper;
		const prototype = instance ? Object.getPrototypeOf(instance) : null;

		return instance && prototype && wrapper.isDependencyTreeStatic();
	});

	public constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly externalContextCreator: ExternalContextCreator,
		private readonly metadataScanner: MetadataScanner,
		private readonly reflector: Reflector
	) {}

	public explore() {
		const listeners = this.flatMap<ListenerMetadata>(wrapper =>
			this.filterProperties(wrapper, LISTENERS_METADATA)
		);

		const components = this.flatMap<ComponentMetadata>(wrapper =>
			this.filterProperties(wrapper, MESSAGE_COMPONENT_METADATA)
		);

		const textCommands = this.flatMap<TextCommandMetadata>(wrapper =>
			this.filterProperties(wrapper, TEXT_COMMAND_METADATA)
		);

		const appCommands = this.flatMap<ApplicationCommandMetadata>(wrapper => {
			const commandGroup = this.filterProvider<SlashCommandMetadata>(wrapper, GROUP_METADATA);

			const subGroups = new Collection<string, any>();
			const subCommands = new Collection<string, any>();
			const commands = new Collection<string, any>();

			const metadataKey = APPLICATION_COMMAND_METADATA;
			const optionalKeys = [
				GROUP_METADATA,
				OPTIONS_METADATA,
				AUTOCOMPLETE_METADATA,
				GUILDS_METADATA
			];

			for (const command of this.filterProperties(wrapper, metadataKey, optionalKeys)) {
				command.options = Object.values(command.metadata[OPTIONS_METADATA] ?? []);

				if (!commandGroup || command.type !== 1) {
					commands.set(command.name, command);
				}

				const subGroup = command.metadata[GROUP_METADATA];

				subGroup
					? subGroups.ensure(subGroup.name, () => subGroup).options.push(command)
					: subCommands.set(command.name, command);
			}

			if (commandGroup) {
				commandGroup.metadata = this.extractOptionalMetadata(
					[GUILDS_METADATA],
					wrapper.instance.constructor
				);
				commandGroup.options = [...subGroups.values(), ...subCommands.values()];
			}

			return [...commands.values()].concat(commandGroup);
		});

		return {
			listeners,
			components,
			appCommands,
			textCommands
		};
	}

	private flatMap<T = any>(callback: (wrapper: InstanceWrapper) => T[] | undefined) {
		return this.wrappers.flatMap(callback).filter(Boolean);
	}

	public filterProvider<T = any>(wrapper: InstanceWrapper, metadataKey: string): T | undefined {
		return this.reflector.get(metadataKey, wrapper.instance.constructor);
	}

	public filterProperties(
		{ instance, host }: InstanceWrapper,
		metadataKey: string,
		optionalMetadataKeys: string[] = []
	) {
		const prototype = Object.getPrototypeOf(instance);

		return this.metadataScanner.scanFromPrototype(instance, prototype, name => {
			const item = this.reflector.get(metadataKey, instance[name]);

			if (!item) return;

			return Object.assign(item, {
				metadata: {
					host,
					class: instance.constructor,
					handler: prototype[name],
					execute: this.createContextCallback(instance, prototype, name),
					...this.extractOptionalMetadata(optionalMetadataKeys, instance[name])
				}
			});
		});
	}

	private extractOptionalMetadata(keys: string[], target: Type | Function) {
		return keys.reduce((acc, key) => ({ ...acc, [key]: this.reflector.get(key, target) }), {});
	}

	private createContextCallback<T extends Record<string, any>>(
		instance: T,
		prototype: any,
		methodName: string
	) {
		return this.externalContextCreator.create<Record<number, ParamMetadata>, NecordContextType>(
			instance,
			prototype[methodName],
			methodName,
			PARAM_ARGS_METADATA,
			this.necordParamsFactory,
			STATIC_CONTEXT,
			undefined,
			{ guards: true, filters: true, interceptors: true },
			'necord'
		);
	}
}
