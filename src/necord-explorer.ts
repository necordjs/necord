import { Collection } from 'discord.js';
import { Injectable } from '@nestjs/common';
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
	PERMISSIONS_METADATA,
	TEXT_COMMAND_METADATA
} from './necord.constants';

type OptionMetadata =
	| string
	| {
			key: string;
			fn: (key: string, targets: any[]) => unknown;
	  };

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
			const subCommands = [];
			const commands = [];

			const metadataKey = APPLICATION_COMMAND_METADATA;
			const optionalKeys: OptionMetadata[] = [
				GROUP_METADATA,
				OPTIONS_METADATA,
				AUTOCOMPLETE_METADATA,
				{
					key: GUILDS_METADATA,
					fn: (key, targets) => this.reflector.getAllAndOverride(key, targets)
				},
				{
					key: PERMISSIONS_METADATA,
					fn: (key, targets) => this.reflector.getAllAndMerge(key, targets)
				}
			];

			for (const command of this.filterProperties(wrapper, metadataKey, optionalKeys)) {
				command.options = Object.values(command.metadata[OPTIONS_METADATA] ?? []);

				if (!commandGroup || command.type !== 1) {
					commands.push(command);
				}

				const subGroup = command.metadata[GROUP_METADATA];

				subGroup
					? subGroups.ensure(subGroup.name, () => subGroup).options.push(command)
					: subCommands.push(command);
			}

			if (commandGroup) {
				commandGroup.metadata = this.extractOptionalMetadata(
					[GUILDS_METADATA, PERMISSIONS_METADATA],
					wrapper.instance
				);

				commandGroup.options = [...subGroups.values(), ...subCommands];
			}

			return commands.concat(commandGroup);
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
		optionalMetadataKeys: OptionMetadata[] = []
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
					...this.extractOptionalMetadata(optionalMetadataKeys, instance, name)
				}
			});
		});
	}

	private extractOptionalMetadata(
		keys: OptionMetadata[],
		instance: Record<string, any>,
		propertyKey?: string
	) {
		const defaultTarget = propertyKey ? instance[propertyKey] : instance.constructor;
		const defaultTargets = [instance[propertyKey], instance.constructor].filter(Boolean);

		return keys.reduce((acc, option) => {
			const isOptionString = typeof option === 'string';
			const key = isOptionString ? option : option.key;
			const value = isOptionString
				? this.reflector.get(key, defaultTarget)
				: option.fn(key, defaultTargets);

			return { ...acc, [key]: value };
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
