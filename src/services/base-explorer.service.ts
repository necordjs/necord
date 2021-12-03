import { Logger, OnModuleInit } from '@nestjs/common';
import { ParamMetadata } from '@nestjs/core/helpers/interfaces';
import { NecordContextType, NecordParamsFactory } from '../context';
import { PARAM_ARGS_METADATA } from '../necord.constants';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

export abstract class BaseExplorerService<R> implements OnModuleInit {
	protected readonly logger = new Logger(this.constructor.name);

	private readonly necordParamsFactory = new NecordParamsFactory();

	protected constructor(
		protected readonly externalContextCreator: ExternalContextCreator,
		protected readonly discoveryService: DiscoveryService
	) {}

	public onModuleInit(): void {
		const providers = this.discoveryService.getProviders();
		const wrappers = providers.filter(wrapper => wrapper.isDependencyTreeStatic());

		this.register(this.flatMap(wrappers, this.filter.bind(this)));
	}

	protected abstract filter(instance: Record<string, any>, prototype: object): R[];

	protected abstract register(items: R[]): void;

	private flatMap(
		wrappers: InstanceWrapper[],
		callback: (instance: Record<string, any>, prototype: object) => R[]
	): R[] {
		return wrappers
			.map(wrapper => {
				const { instance } = wrapper,
					prototype = instance ? Object.getPrototypeOf(instance) : null;

				if (!instance || !prototype) {
					return;
				}

				return callback(instance, prototype);
			})
			.reduce((a, b) => a.concat(b), [])
			.filter(element => !!element) as R[];
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
