import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { ApplicationCommandExecuteMetadata, ListenerExecuteMetadata } from '../interfaces';
import { NecordContextType, NecordParamsFactory } from '../context';
import { PARAM_ARGS_METADATA } from '../necord.constants';
import { ParamMetadata } from '@nestjs/core/helpers/interfaces';
import { flatMap } from '../utils';
import { MetadataAccessorService } from './metadata-accessor.service';
import { RegistryService } from './registry.service';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';

@Injectable()
export class ExplorerService implements OnModuleInit {
	private readonly necordParamsFactory = new NecordParamsFactory();

	public constructor(
		private readonly commandsService: RegistryService,
		private readonly discoveryService: DiscoveryService,
		private readonly externalContextCreator: ExternalContextCreator,
		private readonly metadataScanner: MetadataScanner,
		private readonly metadataAccessor: MetadataAccessorService
	) {}

	public onModuleInit() {
		this.explore();
	}

	private explore() {
		const wrappers = this.discoveryService.getProviders();
		const instances = wrappers.filter(wrapper => wrapper.isDependencyTreeStatic());

		this.registerListeners(instances);
		this.registerApplicationCommands(instances);
	}

	private registerListeners(wrappers: InstanceWrapper[]) {
		const listeners = flatMap<ListenerExecuteMetadata>(wrappers, (instance, prototype) =>
			this.filterListener(instance, prototype)
		);

		listeners.forEach(listener => this.commandsService.registerListener(listener));
	}

	private registerApplicationCommands(wrappers: InstanceWrapper[]) {
		const applicationCommands = flatMap<ApplicationCommandExecuteMetadata>(wrappers, (instance, prototype) =>
			this.filterSlashCommands(instance, prototype)
		);

		return this.commandsService.registerApplicationCommands(applicationCommands);
	}

	private filterListener(instance: Record<string, any>, prototype: object) {
		return this.metadataScanner.scanFromPrototype(instance, prototype, method => {
			const metadata = this.metadataAccessor.getListenerMetadata(instance, method);
			if (!metadata) return;

			return {
				...metadata,
				execute: this.createContextCallback(instance, prototype, method)
			};
		});
	}

	private filterSlashCommands(instance: Record<string, any>, prototype: object) {
		return this.metadataScanner.scanFromPrototype(instance, prototype, method => {
			const command = this.metadataAccessor.getApplicationCommand(instance, method);

			if (!command) return;

			const execute = this.createContextCallback(instance, prototype, method);

			if (command.type === ApplicationCommandTypes.CHAT_INPUT) {
				const group = this.metadataAccessor.getCommandGroup(instance, method);
				const options = this.metadataAccessor.getOptions(instance, method);

				return {
					...command,
					options,
					group: group ?? (command as any).subGroup,
					subGroup: group ? (command as any).subGroup : undefined,
					execute
				};
			}

			return {
				...command,
				execute
			};
		});
	}

	private createContextCallback<T extends Record<string, any>>(instance: T, prototype: any, methodName: string) {
		return this.externalContextCreator.create<Record<number, ParamMetadata>, NecordContextType>(
			instance,
			prototype[methodName],
			methodName,
			PARAM_ARGS_METADATA,
			this.necordParamsFactory,
			undefined,
			undefined,
			{ guards: true, filters: true, interceptors: true },
			'necord'
		);
	}
}
