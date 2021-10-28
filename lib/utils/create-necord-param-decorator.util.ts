import 'reflect-metadata';
import { NecordParamType } from '../context';
import { assignMetadata, PipeTransform, Type } from '@nestjs/common';
import { PARAM_ARGS_METADATA } from '../necord.constants';
import { isNil, isString } from '@nestjs/common/utils/shared.utils';

export function createNecordParamDecorator(
	type: NecordParamType
): (...pipes: (Type<PipeTransform> | PipeTransform)[]) => ParameterDecorator {
	return (...pipes: (Type<PipeTransform> | PipeTransform)[]) =>
		(target, key, index) => {
			const args = Reflect.getMetadata(PARAM_ARGS_METADATA, target.constructor, key) || {};
			Reflect.defineMetadata(
				PARAM_ARGS_METADATA,
				assignMetadata(args, type, index, undefined, ...pipes),
				target.constructor,
				key
			);
		};
}

export function createNecordPipesParamDecorator(type: NecordParamType) {
	return (data?: any, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator =>
		(target, key, index) => {
			const args = Reflect.getMetadata(PARAM_ARGS_METADATA, target.constructor, key) || {};
			const hasParamData = isNil(data) || isString(data);
			const paramData = hasParamData ? data : undefined;
			const paramPipes = hasParamData ? pipes : [data, ...pipes];

			Reflect.defineMetadata(
				PARAM_ARGS_METADATA,
				assignMetadata(args, type, index, paramData, ...paramPipes),
				target.constructor,
				key
			);
		};
}
