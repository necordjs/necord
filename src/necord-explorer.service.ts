import { Injectable } from '@nestjs/common';
import { NecordBaseDiscovery, NecordContextType, NecordParamsFactory } from './context';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ParamMetadata } from '@nestjs/core/helpers/interfaces';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';

@Injectable()
export class NecordExplorerService extends Reflector {
	private readonly necordParamsFactory = new NecordParamsFactory();

	private readonly wrappers = this.discoveryService.getProviders().filter(wrapper => {
		const { instance } = wrapper;
		const prototype = instance ? Object.getPrototypeOf(instance) : null;

		return instance && prototype && wrapper.isDependencyTreeStatic();
	});

	public constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly externalContextCreator: ExternalContextCreator,
		private readonly metadataScanner: MetadataScanner
	) {
		super();
	}

	public explore<T extends NecordBaseDiscovery>(metadataKey: string) {
		return this.flatMap<T>(wrapper => this.filterProperties<T>(wrapper.instance, metadataKey));
	}

	private flatMap<T extends NecordBaseDiscovery>(callback: (wrapper: InstanceWrapper) => T[]) {
		return this.wrappers.flatMap(callback).filter(Boolean);
	}

	private filterProperties<T extends NecordBaseDiscovery>(instance: any, metadataKey: string) {
		const prototype = Object.getPrototypeOf(instance);

		return this.metadataScanner.scanFromPrototype(instance, prototype, methodName => {
			const item = this.get<T>(metadataKey, instance[methodName]);

			if (!item) return;

			item.setDiscoveryMeta({ class: instance.constructor, handler: instance[methodName] });
			item.setContextCallback(this.createContextCallback(instance, prototype, methodName));

			return item;
		});
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
			ROUTE_ARGS_METADATA,
			this.necordParamsFactory,
			STATIC_CONTEXT,
			undefined,
			{ guards: true, filters: true, interceptors: true },
			'necord'
		);
	}
}
