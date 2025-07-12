import { Injectable } from '@nestjs/common';
import { ContextId, ModuleRef } from '@nestjs/core';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { ParamMetadata } from '@nestjs/core/helpers/interfaces';
import {
	NecordBaseDiscovery,
	NecordContextType,
	NecordParamsFactory,
	NecordParamType
} from './context';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { AsyncContext } from './scopes';

@Injectable()
export class NecordContextCreator {
	private readonly necordParamsFactory = new NecordParamsFactory();

	public constructor(private readonly externalContextCreator: ExternalContextCreator) {}

	public bind(wrapper: InstanceWrapper, methodName: string) {
		const instance = wrapper.instance;

		if (wrapper.isDependencyTreeStatic() && !wrapper.isTransient) {
			return this.createContextCallback(instance, methodName);
		}

		const { instance: moduleRef } = wrapper.host.getProviderByKey<ModuleRef>(ModuleRef);

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

			const requestScopedInstance = await moduleRef.resolve(wrapper.metatype, context.id, {
				strict: true
			});

			const contextCallback = this.createContextCallback(
				requestScopedInstance,
				methodName,
				context.id,
				wrapper.id
			);
			return contextCallback(...args);
		};
	}

	private createContextCallback(
		instance: object,
		methodName: string,
		contextId: ContextId = STATIC_CONTEXT,
		wrapperId?: string
	) {
		const prototype = Object.getPrototypeOf(instance);

		if (!instance || !prototype || !prototype[methodName]) {
			return;
		}

		return this.externalContextCreator.create<Record<number, ParamMetadata>, NecordContextType>(
			instance,
			prototype[methodName],
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
