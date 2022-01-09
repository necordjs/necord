import { Collection } from 'discord.js';
import { Injectable, Type } from '@nestjs/common';
import { ParamMetadata } from '@nestjs/core/helpers/interfaces';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { NecordContextType, NecordParamsFactory } from './context';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import {
	ComponentMetadata,
	ContextMenuMetadata,
	ListenerMetadata,
	SimpleCommandMetadata,
	SlashCommandMetadata
} from './interfaces';
import {
	AUTOCOMPLETE_METADATA,
	CONTEXT_MENU_METADATA,
	GROUP_METADATA,
	LISTENERS_METADATA,
	MESSAGE_COMPONENT_METADATA,
	OPTIONS_METADATA,
	PARAM_ARGS_METADATA,
	SIMPLE_COMMAND_METADATA,
	SLASH_COMMAND_METADATA
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

		const simpleCommands = this.flatMap<SimpleCommandMetadata>(wrapper =>
			this.filterProperties(wrapper, SIMPLE_COMMAND_METADATA)
		);

		const contextMenus = this.flatMap<ContextMenuMetadata>(wrapper =>
			this.filterProperties(wrapper, CONTEXT_MENU_METADATA)
		);

		const slashCommands = this.flatMap<SlashCommandMetadata>(wrapper => {
			const commandGroup = this.filterProvider<SlashCommandMetadata>(wrapper, GROUP_METADATA);
			const subGroups = new Collection<string, any>();
			const subCommands = new Collection<string, any>();

			const metadataKey = SLASH_COMMAND_METADATA;
			const optionalKeys = [GROUP_METADATA, OPTIONS_METADATA, AUTOCOMPLETE_METADATA];

			for (const command of this.filterProperties(wrapper, metadataKey, optionalKeys)) {
				command.options = Object.values(command.metadata[OPTIONS_METADATA] ?? []);
				const subGroup = command.metadata[GROUP_METADATA];

				commandGroup && subGroup
					? subGroups.ensure(subGroup.name, () => subGroup).options.push(command)
					: subCommands.set(command.name, command);
			}

			if (commandGroup) {
				commandGroup.options = [...subGroups.values(), ...subCommands.values()];
			}

			return !commandGroup ? [...subCommands.values()] : [commandGroup];
		});

		return {
			listeners,
			components,
			contextMenus,
			slashCommands,
			simpleCommands
		};
	}

	private flatMap<T>(callback: (wrapper: InstanceWrapper) => T[] | undefined) {
		return this.wrappers.flatMap(callback).filter(Boolean);
	}

	public filterProvider<T>({ instance }: InstanceWrapper, metadataKey: string): T | undefined {
		return this.extractMetadata(metadataKey, instance.constructor);
	}

	public filterProperties(
		{ instance, host }: InstanceWrapper,
		metadataKey: string,
		optionalMetadataKeys: string[] = []
	) {
		const prototype = Object.getPrototypeOf(instance);

		return this.metadataScanner.scanFromPrototype(instance, prototype, name => {
			const item = this.extractMetadata(metadataKey, instance[name]);

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

	private extractMetadata(metadataKey: string, target: Function | Type) {
		return this.reflector.get(metadataKey, target);
	}

	private extractOptionalMetadata(metadataKeys: string[], target: Function | Type) {
		return metadataKeys.reduce((acc, metadataKey) => {
			acc[metadataKey] = this.extractMetadata(metadataKey, target);
			return acc;
		}, {});
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
