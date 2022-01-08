import { NecordParamType } from '../context';
import { assignMetadata, ParamDecoratorEnhancer, PipeTransform, Type } from '@nestjs/common';
import { PARAM_ARGS_METADATA } from '../necord.constants';
import { isFunction, isNil } from '@nestjs/common/utils/shared.utils';

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
