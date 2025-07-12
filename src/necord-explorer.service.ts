import { Injectable } from '@nestjs/common';
import { NecordBaseDiscovery } from './context';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { NecordContextCreator } from './necord-context.creator';

/**
 * Represents a explorer service.
 * This service is used to explore the application and retrieve the discovery items.
 */
@Injectable()
export class NecordExplorerService<T extends NecordBaseDiscovery> {
	private readonly wrappers = this.discoveryService.getProviders().filter(wrapper => {
		const { instance } = wrapper;
		const prototype = instance ? Object.getPrototypeOf(instance) : null;

		return instance && prototype;
	});

	public constructor(
		private readonly reflector: Reflector,
		private readonly discoveryService: DiscoveryService,
		private readonly metadataScanner: MetadataScanner,
		private readonly necordContextCreator: NecordContextCreator
	) {}

	public explore(metadataKey: string): T[] {
		return this.flatMap(wrapper => this.filterProperties(wrapper, metadataKey));
	}

	private flatMap(callback: (wrapper: InstanceWrapper) => T[]) {
		return this.wrappers.flatMap(callback).filter(Boolean);
	}

	private filterProperties(wrapper: InstanceWrapper, metadataKey: string) {
		const { instance } = wrapper;
		const prototype = Object.getPrototypeOf(instance);

		return this.metadataScanner.getAllMethodNames(prototype).map(methodName => {
			const item = this.reflector.get<T>(metadataKey, instance[methodName]);

			if (!item) return;

			item.setDiscoveryMeta({ class: instance.constructor, handler: instance[methodName] });
			item.setContextCallback(this.necordContextCreator.bind(wrapper, methodName));

			return item;
		});
	}
}
