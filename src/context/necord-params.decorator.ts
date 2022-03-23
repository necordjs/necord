import { NecordParamType } from './necord-params.factory';
import { assignMetadata, ParamDecoratorEnhancer, PipeTransform, Type } from '@nestjs/common';
import { isFunction, isNil } from '@nestjs/common/utils/shared.utils';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { OPTIONS_METADATA } from '../commands';

export const PARAM_ARGS_METADATA = ROUTE_ARGS_METADATA;

export const Context = createNecordParamDecorator(NecordParamType.CONTEXT);

export const Options = createNecordPipesParamDecorator(NecordParamType.OPTIONS, [
	(target, propertyKey, parameterIndex) => {
		const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
		let prototype = Reflect.getPrototypeOf(new paramTypes[parameterIndex]());

		const options = {};

		for (; prototype !== Object.prototype; prototype = Reflect.getPrototypeOf(prototype)) {
			Object.getOwnPropertyNames(prototype)
				.map(name => [name, Reflect.getMetadata(OPTIONS_METADATA, prototype, name)])
				.filter(([, meta]) => !!meta)
				.forEach(([name, meta]) => (options[name] = meta));
		}

		Reflect.defineMetadata(OPTIONS_METADATA, options, target[propertyKey]);
		console.log(options)
	}
]);

export const Discovery = createNecordPipesParamDecorator(NecordParamType.DISCOVERY);

export const Ctx = Context;

export const Opts = Options;

export function createNecordParamDecorator(
	type: NecordParamType,
	enhancers: ParamDecoratorEnhancer[] = []
): (...pipes: (Type<PipeTransform> | PipeTransform)[]) => ParameterDecorator {
	return (...pipes: (Type<PipeTransform> | PipeTransform)[]) =>
		createNecordPipesParamDecorator(type, enhancers)(pipes);
}

export function createNecordPipesParamDecorator(
	type: NecordParamType,
	enhancers: ParamDecoratorEnhancer[] = []
) {
	return (data?: any, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator =>
		(target, key, index) => {
			const args = Reflect.getMetadata(PARAM_ARGS_METADATA, target.constructor, key) || {};

			const isPipe = (pipe: any) =>
				pipe &&
				((isFunction(pipe) && pipe.prototype && isFunction(pipe.prototype.transform)) ||
					isFunction(pipe.transform));

			const hasParamData = isNil(data) || !isPipe(data);
			const paramData = hasParamData ? data : undefined;
			const paramPipes = hasParamData ? pipes : [data, ...pipes];

			Reflect.defineMetadata(
				PARAM_ARGS_METADATA,
				assignMetadata(args, type, index, paramData, ...paramPipes),
				target.constructor,
				key
			);

			enhancers.forEach(fn => fn(target, key, index));
		};
}
