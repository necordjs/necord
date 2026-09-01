import { ParamMetadata } from '@nestjs/core/helpers/interfaces/params-metadata.interface';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ContextId, ModuleRef } from '@nestjs/core';
import { Injectable } from '@nestjs/common';

import {
	NecordBaseDiscovery,
	NecordContextType,
	NecordParamsFactory,
	NecordParamType
} from './context/index.js';
import { AsyncContext } from './scopes/index.js';

@Injectable()
export class NecordContextCreator {
	private readonly necordParamsFactory = new NecordParamsFactory();

	public constructor(private readonly externalContextCreator: ExternalContextCreator) {}

	public bind(wrapper: InstanceWrapper, methodName: string) {
		const instance = wrapper.instance;

		if (wrapper.isDependencyTreeStatic() && !wrapper.isTransient) {
			return this.createContextCallback(instance, methodName);
		}

		const host = wrapper.host;

		if (!host) {
			throw new Error('A request-scoped provider must have a Nest module host.');
		}

		const { instance: moduleRef } = host.getProviderByKey<ModuleRef>(ModuleRef);

		return async (...args: any[]) => {
			const necordContext = this.necordParamsFactory.exchangeKeyForValue(
				NecordParamType.CONTEXT,
				undefined,
				args as [Array<any>, NecordBaseDiscovery]
			);
			const context = AsyncContext.of(necordContext) ?? new AsyncContext();

			if (!AsyncContext.isAttached(necordContext)) {
				moduleRef.registerRequestByContextId(necordContext, context.id);
				context.attachTo(necordContext);
			}

			if (!wrapper.metatype) {
				throw new Error('A request-scoped provider must have a metatype.');
			}

			const requestScopedInstance = await moduleRef.resolve(wrapper.metatype, context.id, {
				strict: true
			});

			const contextCallback = this.createContextCallback(
				requestScopedInstance,
				methodName,
				context.id,
				wrapper.id
			);
			return contextCallback?.(...args);
		};
	}

	private createContextCallback(
		instance: object | undefined,
		methodName: string,
		contextId: ContextId = STATIC_CONTEXT,
		wrapperId?: string
	) {
		if (!instance || typeof instance[methodName] !== 'function') {
			return;
		}

		const prototype = Object.getPrototypeOf(instance);
		const handler = prototype?.[methodName];

		if (typeof handler !== 'function') {
			return;
		}

		return this.externalContextCreator.create<Record<number, ParamMetadata>, NecordContextType>(
			instance,
			handler,
			methodName,
			ROUTE_ARGS_METADATA,
			this.necordParamsFactory,
			contextId,
			wrapperId,
			{ guards: true, filters: true, interceptors: true },
			'necord'
		);
	}
}
