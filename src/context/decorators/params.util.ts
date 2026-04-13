import { NecordParamType } from '../necord-paramtype.enum';
import { assignMetadata, PipeTransform, Type } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

export function createNecordParamDecorator(type: NecordParamType) {
	return (...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator =>
		(target, key, index) => {
			if (key === undefined) {
				throw new TypeError('Param decorators cannot be used on constructor');
			}

			const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};

			Reflect.defineMetadata(
				ROUTE_ARGS_METADATA,
				assignMetadata(args, type, index, undefined, ...pipes),
				target.constructor,
				key
			);
		};
}
