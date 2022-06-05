import { NecordParamType } from '../necord-paramtype.enum';
import { assignMetadata, PipeTransform, Type } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { isFunction, isNil } from '@nestjs/common/utils/shared.utils';

export const createNecordParamDecorator = (
	type: NecordParamType
): ((...pipes: (Type<PipeTransform> | PipeTransform)[]) => ParameterDecorator) =>
	createNecordPipesParamDecorator(type);

export function createNecordPipesParamDecorator(type: NecordParamType) {
	return (data?: any, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator =>
		(target, key, index) => {
			const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};

			const isPipe = (pipe: any) =>
				pipe &&
				((isFunction(pipe) && pipe.prototype && isFunction(pipe.prototype.transform)) ||
					isFunction(pipe.transform));

			const hasParamData = isNil(data) || !isPipe(data);
			const paramData = hasParamData ? data : undefined;
			const paramPipes = hasParamData ? pipes : [data, ...pipes];

			Reflect.defineMetadata(
				ROUTE_ARGS_METADATA,
				assignMetadata(args, type, index, paramData, ...paramPipes),
				target.constructor,
				key
			);
		};
}
