import { Injectable, Type } from '@nestjs/common';
import { NecordBaseDiscovery } from './context';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { NecordContextType, NecordParamsFactory } from './context';
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

	public exploreProviders<T, U extends NecordBaseDiscovery>(
		metadataKey: string,
		clazz: Type<U>,
		fn: (discovery: U) => void
	) {
		return this.flatMap(wrapper => this.filterProvider(wrapper, metadataKey))
			.filter(Boolean)
			.forEach(provider => fn(new clazz(provider.meta, provider.discovery)));
	}

	public exploreMethods<T extends NecordBaseDiscovery>(
		metadataKey: string,
		fn: (discovery: T) => void
	) {
		return this.flatMap<T>(wrapper =>
			this.filterProperties(wrapper, metadataKey).filter(Boolean)
		).forEach(fn);
	}

	private flatMap<T = any>(callback: (wrapper: InstanceWrapper) => T[] | undefined) {
		return this.wrappers.flatMap(callback).filter(Boolean);
	}

	private filterProvider<T = any>(wrapper: InstanceWrapper, metadataKey: string): T | undefined {
		return this.get(metadataKey, wrapper.instance.constructor);
	}

	private filterProperties({ instance }: InstanceWrapper, metadataKey: string) {
		const prototype = Object.getPrototypeOf(instance);

		return this.metadataScanner.scanFromPrototype(instance, prototype, methodName => {
			const item = this.get(metadataKey, instance[methodName]);

			if (!item) return;

			item.setDiscoveryMeta({
				class: instance.constructor,
				handler: instance[methodName],
				methodName
			});
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
