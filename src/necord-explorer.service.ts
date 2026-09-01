import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Injectable } from '@nestjs/common';

import { NecordContextCreator } from './necord-context.creator.js';
import { NecordBaseDiscovery } from './context/index.js';

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
		return this.wrappers.flatMap(callback).filter((item): item is T => Boolean(item));
	}

	private filterProperties(wrapper: InstanceWrapper, metadataKey: string) {
		const { instance } = wrapper;

		if (!instance) {
			return [];
		}

		const prototype = Object.getPrototypeOf(instance);

		return this.metadataScanner.getAllMethodNames(prototype).flatMap(methodName => {
			const handler = instance[methodName];

			if (typeof handler !== 'function') {
				return [];
			}

			const item = this.reflector.get<T>(metadataKey, handler);

			if (!item) return [];

			const contextCallback = this.necordContextCreator.bind(wrapper, methodName);

			if (!contextCallback) return [];

			item.setDiscoveryMeta({ class: instance.constructor, handler });
			item.setContextCallback(contextCallback);

			return [item];
		});
	}
}
