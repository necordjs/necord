import { Injectable } from '@nestjs/common';
import { ParamMetadata } from '@nestjs/core/helpers/interfaces';
import { NecordContextType, NecordParamsFactory } from '../context';
import { PARAM_ARGS_METADATA } from '../necord.constants';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';

type ExploreReturn<T> = T & { execute: (...args) => any };

type ExploreFilter<T> = (instance: Record<string, any>, prototype: object, name: string) => T;

@Injectable()
export class ExplorerService<T> {
	private readonly necordParamsFactory = new NecordParamsFactory();

	private readonly wrappers = this.discoveryService
		.getProviders()
		.filter(wrapper => wrapper.isDependencyTreeStatic());

	public constructor(
		private readonly discoveryService: DiscoveryService,
		private readonly externalContextCreator: ExternalContextCreator,
		private readonly metadataScanner: MetadataScanner
	) {}

	public explore(filter: ExploreFilter<T>): ExploreReturn<T>[] {
		return this.wrappers.reduce((acc: ExploreReturn<T>[], { instance }) => {
			const prototype = instance ? Object.getPrototypeOf(instance) : null;

			if (!instance || !prototype) {
				return acc;
			}

			this.metadataScanner.scanFromPrototype(instance, prototype, name => {
				const filtered = filter(instance, prototype, name);

				filtered &&
					acc.push(
						Object.assign(filtered, {
							execute: this.createContextCallback(instance, prototype, name)
						})
					);
			});

			return acc;
		}, []);
	}

	protected createContextCallback<T extends Record<string, any>>(instance: T, prototype: any, methodName: string) {
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
