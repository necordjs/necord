import { Provider } from '@nestjs/common';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { ParamMetadata } from '@nestjs/core/helpers/interfaces';
import { NecordContextType } from './necord-execution-context';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { necordParamsFactory } from './necord-params.factory';
import { PARAM_ARGS_METADATA } from './necord-params.decorator';

export const NECORD_CONTEXT_PROVIDER = 'necord:context_provider';

let externalContextCreator: ExternalContextCreator;

export const necordContextCreator: Provider<any> = {
	provide: NECORD_CONTEXT_PROVIDER,
	useFactory: (contextCreator: ExternalContextCreator) => {
		externalContextCreator = contextCreator;
	},
	inject: [ExternalContextCreator]
};

export function createNecordContext<T extends Record<string, any>>(
	instance: T,
	prototype: any,
	methodName: string
) {
	return externalContextCreator.create<Record<number, ParamMetadata>, NecordContextType>(
		instance,
		prototype[methodName],
		methodName,
		PARAM_ARGS_METADATA,
		necordParamsFactory,
		STATIC_CONTEXT,
		undefined,
		{ guards: true, filters: true, interceptors: true },
		'necord'
	);
}
